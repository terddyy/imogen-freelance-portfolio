import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  isValidTurnstileResult,
  TURNSTILE_ACTION,
} from "../lib/turnstile-validation.ts";

const allowedHostnames = new Set(["www.imogen.dev", "imogen.dev"]);

assert.equal(
  isValidTurnstileResult(
    { success: true, action: TURNSTILE_ACTION, hostname: "www.imogen.dev" },
    allowedHostnames,
  ),
  true,
);
assert.equal(
  isValidTurnstileResult(
    { success: true, action: "different-form", hostname: "www.imogen.dev" },
    allowedHostnames,
  ),
  false,
);
assert.equal(
  isValidTurnstileResult(
    { success: true, action: TURNSTILE_ACTION, hostname: "attacker.example" },
    allowedHostnames,
  ),
  false,
);
assert.equal(
  isValidTurnstileResult(
    { success: false, action: TURNSTILE_ACTION, hostname: "www.imogen.dev" },
    allowedHostnames,
  ),
  false,
);

assert.equal(existsSync(new URL("../app/api/chat/route.ts", import.meta.url)), false);

const routeSource = readFileSync(new URL("../app/api/project-inquiry/route.ts", import.meta.url), "utf8");
const postSource = routeSource.slice(routeSource.indexOf("export async function POST"));
const parseIndex = postSource.indexOf("JSON.parse(rawBody)");
const captchaIndex = postSource.indexOf("verifyTurnstileToken(");
const globalQuotaIndex = postSource.indexOf('consumeRateLimit("project-inquiry-global"');
const deliveryIndex = postSource.indexOf("await sendInquiryEmail(");

assert(parseIndex >= 0 && captchaIndex > parseIndex, "Turnstile must run after body validation starts");
assert(globalQuotaIndex > captchaIndex, "The global delivery quota must run after Turnstile validation");
assert(deliveryIndex > globalQuotaIndex, "The global delivery quota must run before email delivery");

console.log("API security regression check passed.");
