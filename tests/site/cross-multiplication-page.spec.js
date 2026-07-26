const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const ROOT = path.resolve(__dirname, "../..");
const SEGMENTS = [
  "00_初高中衔接知识",
  "chapter_03_多项式变形与因式分解",
  "02_十字相乘法.html",
];
const ROUTE = `/${SEGMENTS.map(encodeURIComponent).join("/")}`;
const SOURCE = path.join(
  ROOT,
  "00_初高中衔接知识",
  "chapter_03_多项式变形与因式分解",
  "02_十字相乘法.md",
);

test("十字相乘法页先说明适用范围，再说明依据和步骤", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });

  await expect(page.locator("#practice, [data-practice]")).toHaveCount(0);

  const pageText = await page.locator("body").innerText();
  const sourceText = fs.readFileSync(SOURCE, "utf8");
  const informalPattern = /读完后|你应该|你就会明白|不是[^。\n]{0,80}而是|这一节要|核心问题/;
  const expectedSections = [
    "1. 二次三项式的因式分解",
    "2. 交叉乘积与系数对应",
    "3. 基本方法与步骤",
  ];
  const pageSections = await page.locator("main > .section h2").allTextContents();
  const sourceSections = [...sourceText.matchAll(/^## (.+)$/gm)].map((match) => match[1]);

  expect(pageText).not.toMatch(informalPattern);
  expect(sourceText).not.toMatch(informalPattern);
  expect(pageSections).toEqual(expectedSections);
  expect(sourceSections).toEqual(expectedSections);
  expect(pageText.indexOf("适用范围")).toBeLessThan(pageText.indexOf("基本方法与步骤"));
  expect(sourceText.indexOf("当各项没有可提取的公因式")).toBeLessThan(
    sourceText.indexOf("基本方法与步骤"),
  );
  expect(sourceText).not.toContain(String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`);
  expect(pageText).not.toContain("求根公式的推导");
});

test("十字相乘法页保持紧凑的模块间距", async ({ page }) => {
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
