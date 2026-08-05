/* Visual harness. Usage:
     node prototypes/agents-hero/shoot.js layers.html /tmp/out [presetIndex]
   Captures #stage in both themes at ~2s and ~25s with the pointer parked
   inside the stage, and fails loudly on any console error. */
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright-core");

const EXEC =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/" +
  "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const [, , file, outDir, presetArg] = process.argv;
const preset = Number(presetArg || 0);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC });
  const errors = [];

  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[${width}] ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`[${width}] ${e.message}`));

    await page.goto("file://" + path.resolve(file));
    await page.waitForTimeout(300);
    await page.keyboard.press(String(preset + 1));

    const stage = page.locator("#stage");
    // The stage sits below two toolbars, so the pointer must be placed from
    // its measured box. Guessing coordinates misses it and pointer behaviour
    // never appears in the capture.
    const box = await stage.boundingBox();
    await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5);

    for (const theme of ["dark", "light"]) {
      if (theme === "light") await page.keyboard.press("t");
      for (const at of [2000, 25000]) {
        await page.waitForTimeout(at === 2000 ? 2000 : 23000);
        await stage.screenshot({
          path: `${outDir}/${width}-${theme}-${at / 1000}s.png`,
        });
      }
    }

    const fps = await page.locator("#fps").textContent();
    console.log(`width ${width}: fps readout = ${fps.trim()}`);
    await page.close();
  }

  await browser.close();
  if (errors.length) {
    console.error("CONSOLE ERRORS:\n" + errors.join("\n"));
    process.exit(1);
  }
  console.log("no console errors");
})();
