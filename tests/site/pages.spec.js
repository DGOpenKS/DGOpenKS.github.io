const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const ROOT = path.resolve(__dirname, "../..");
const SKIP_DIRS = new Set([".git", ".venv", "node_modules", "_render", "renders"]);

function collectPages(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectPages(fullPath, output);
    else if (entry.name.endsWith(".html")) output.push(path.relative(ROOT, fullPath));
  }
  return output;
}

const pages = collectPages(ROOT).sort();

for (const relativePath of pages) {
  test(`${relativePath} loads without local runtime failures`, async ({ page }) => {
    const pageErrors = [];
    const localRequestFailures = [];

    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      const url = new URL(request.url());
      if (url.hostname === "127.0.0.1") {
        localRequestFailures.push(`${url.pathname}: ${request.failure()?.errorText || "request failed"}`);
      }
    });

    const urlPath = `/${relativePath.split(path.sep).map(encodeURIComponent).join("/")}`;
    const response = await page.goto(urlPath, { waitUntil: "domcontentloaded" });

    expect(response, "Page should return a response").not.toBeNull();
    expect(response.status(), "Page should not return an HTTP error").toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
    expect(pageErrors, "Uncaught page errors").toEqual([]);
    expect(localRequestFailures, "Failed local asset requests").toEqual([]);
  });
}
