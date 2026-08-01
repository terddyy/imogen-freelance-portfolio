import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:3000";
const output = process.argv[3] ?? "output/playwright/screenshot.png";

await mkdir(path.dirname(output), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: output, fullPage: true });

await browser.close();

console.log(`Saved screenshot to ${output}`);
