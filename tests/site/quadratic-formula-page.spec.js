const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const ROOT = path.resolve(__dirname, "../..");
const SEGMENTS = [
  "00_初高中衔接知识",
  "chapter_03_多项式变形与因式分解",
  "03_求根公式法.html",
];
const ROUTE = `/${SEGMENTS.map(encodeURIComponent).join("/")}`;
const SOURCE = path.join(
  ROOT,
  "00_初高中衔接知识",
  "chapter_03_多项式变形与因式分解",
  "03_求根公式法.md",
);

test("求根公式法页独立完成公式推导和因式分解", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });

  await expect(page.locator("#practice, [data-practice]")).toHaveCount(0);

  const pageText = await page.locator("body").innerText();
  const sourceText = fs.readFileSync(SOURCE, "utf8");
  const informalPattern = /读完后|你应该|你就会明白|不是[^。\n]{0,80}而是|这一节要|核心问题/;
  const expectedSections = [
    "1. 求根公式法的适用情形",
    "2. 求根公式的推导",
    "3. 由根写成因式",
    "4. 完整计算与适用范围",
  ];
  const pageSections = await page.locator("main > .section h2").allTextContents();
  const sourceSections = [...sourceText.matchAll(/^## (.+)$/gm)].map((match) => match[1]);

  expect(pageText).not.toMatch(informalPattern);
  expect(sourceText).not.toMatch(informalPattern);
  expect(pageSections).toEqual(expectedSections);
  expect(sourceSections).toEqual(expectedSections);
  expect(sourceText).toContain(String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`);
  expect(sourceText).toContain(String.raw`ax^2+bx+c=a(x-x_1)(x-x_2)`);
  expect(pageText.indexOf("求根公式的推导")).toBeLessThan(pageText.indexOf("由根写成因式"));
});

test("求根公式法页保持紧凑的模块间距", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });

  const desktopSpacing = await page.locator("main .section").evaluateAll((sections) =>
    sections.map((section) => {
      const style = getComputedStyle(section);
      return {
        top: Number.parseFloat(style.paddingTop),
        bottom: Number.parseFloat(style.paddingBottom),
      };
    }),
  );

  for (const spacing of desktopSpacing) {
    expect(spacing.top).toBeLessThanOrEqual(60);
    expect(spacing.bottom).toBeLessThanOrEqual(60);
  }

  await page.setViewportSize({ width: 390, height: 844 });

  const mobileSpacing = await page.locator("main .section").evaluateAll((sections) =>
    sections.map((section) => {
      const style = getComputedStyle(section);
      return {
        top: Number.parseFloat(style.paddingTop),
        bottom: Number.parseFloat(style.paddingBottom),
      };
    }),
  );

  for (const spacing of mobileSpacing) {
    expect(spacing.top).toBeLessThanOrEqual(44);
    expect(spacing.bottom).toBeLessThanOrEqual(44);
  }
});
