import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3000";

async function installTurnstileStub(context, scenario) {
  await context.addInitScript((selectedScenario) => {
    window.__turnstileRenderCount = 0;
    window.turnstile = {
      render(element, options) {
        window.__turnstileRenderCount += 1;
        const host = typeof element === "string" ? document.querySelector(element) : element;
        host?.replaceChildren(Object.assign(document.createElement("div"), { textContent: "Security check" }));
        window.setTimeout(() => {
          if (selectedScenario === "success") options.callback?.("playwright-test-token");
          else options["error-callback"]?.("600010");
        }, 0);
        return `stub-${window.__turnstileRenderCount}`;
      },
      remove() {},
    };
  }, scenario);
}

async function reachContactStep(page) {
  await page.goto(`${baseUrl}/inquire`, { waitUntil: "networkidle" });
  await page.getByLabel("Website").click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox", { name: "Project goals" }).fill("Inquiry UI regression check");
  await page.getByLabel("Solo founder").click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator('input[type="radio"]').first().click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator('input[type="radio"]').first().click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("textbox", { name: "Phone number" }).fill("+639602506993");
  await page.getByText(/I've read the privacy notice/).click();
}

async function assertSubmitLayout(page, minimumWidth) {
  const submit = page.getByRole("button", { name: /Send (me the )?meeting link/ });
  const box = await submit.boundingBox();
  assert(box, "Submit button must be visible");
  assert(box.width >= minimumWidth, `Submit button width ${box.width}px is below ${minimumWidth}px`);
  assert(box.height >= 40 && box.height <= 72, `Submit button height ${box.height}px must stay horizontal`);
  assert.equal(await submit.evaluate((element) => getComputedStyle(element).whiteSpace), "nowrap");
  return submit;
}

async function assertSuccessLayout(page, viewport) {
  await page.route("**/api/project-inquiry", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  await page.getByRole("button", { name: /Send (me the )?meeting link/ }).click();
  await page.getByRole("heading", { name: "Your project is on my radar." }).waitFor();

  const badge = page.locator(".sectionLabel");
  const returnLink = page.getByRole("link", { name: "Back to portfolio" });
  const [badgeBox, returnBox, returnColor] = await Promise.all([
    badge.boundingBox(),
    returnLink.boundingBox(),
    returnLink.evaluate((element) => getComputedStyle(element).backgroundColor),
  ]);

  assert(badgeBox, "Project inquiry badge must be visible");
  assert(returnBox, "Back to portfolio link must be visible");
  assert(badgeBox.height <= 40, `Project inquiry badge height ${badgeBox.height}px must stay compact`);
  assert(
    returnBox.height >= 44 && returnBox.height <= 64,
    `Back to portfolio height ${returnBox.height}px must stay button-sized`,
  );
  assert.notEqual(returnColor, "rgba(0, 0, 0, 0)", "Back to portfolio must retain a visible fill");
  assert(returnBox.y + returnBox.height <= viewport.height, "Success action must remain above the fold");
}

async function runScenario(browser, { scenario, viewport, minimumWidth }) {
  const context = await browser.newContext({ viewport });
  await installTurnstileStub(context, scenario);
  const page = await context.newPage();
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );

  await reachContactStep(page);
  const submit = await assertSubmitLayout(page, minimumWidth);

  if (scenario === "success") {
    await page.getByText("Security check").waitFor();
    await page.waitForFunction(() => !document.querySelector('button[type="submit"]')?.hasAttribute("disabled"));
    assert.equal(await submit.isEnabled(), true, "Verified security check must enable submission");
    await assertSuccessLayout(page, viewport);
  } else {
    await page.getByRole("alert").filter({ hasText: "Security check couldn't finish" }).waitFor();
    assert.equal(await submit.isDisabled(), true, "Failed security check must keep submission disabled");
    await page.getByRole("link", { name: "Call instead" }).waitFor();
    await page.getByRole("link", { name: "WhatsApp" }).waitFor();
    await page.getByRole("button", { name: "Retry security check" }).click();
    await page.waitForFunction(() => window.__turnstileRenderCount >= 2);
  }

  await context.close();
}

const browser = await chromium.launch();
try {
  await runScenario(browser, {
    scenario: "success",
    viewport: { width: 390, height: 844 },
    minimumWidth: 200,
  });
  await runScenario(browser, {
    scenario: "error",
    viewport: { width: 390, height: 844 },
    minimumWidth: 200,
  });
  await runScenario(browser, {
    scenario: "success",
    viewport: { width: 1440, height: 900 },
    minimumWidth: 400,
  });
  console.log("Inquiry UI regression check passed.");
} finally {
  await browser.close();
}
