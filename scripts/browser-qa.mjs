import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

// Browser plugin/IAB is used first for manual UI checks. This reproducible
// headless pass adds complete mission workflows and reliable full screenshots.
const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:4173";
const captureOnly = process.env.QA_CAPTURE_ONLY === "1";
const output = process.env.QA_OUTPUT_DIR ?? "tmp/browser-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("response", (response) => {
  if (
    response.status() >= 400 &&
    new URL(response.url()).origin === new URL(base).origin
  )
    errors.push(`${response.status()} ${response.url()}`);
});
const role = (name) => page.getByRole("button", { name, exact: true });
const snapshot = () =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("little-orbit.mission.v1")),
  );
const geom = () =>
  page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    missing: [...document.images]
      .filter((i) => !i.complete || !i.naturalWidth)
      .map((i) => i.src),
  }));
await page.goto(base);
await page.evaluate(() => document.fonts.ready);
await page.locator(".outpost-scene img").evaluate((i) => i.decode());
await page.screenshot({
  path: `${output}/mission-control-desktop.png`,
  fullPage: true,
});
if (captureOnly) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: `${output}/mission-control-mobile.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 1536, height: 1024 });
  await role("Flight school").click();
  await page.screenshot({
    path: `${output}/flight-school.png`,
    fullPage: true,
  });
  await browser.close();
  process.exit(0);
}

await role("Check your resource forecast").click();
assert.equal(await page.getByRole("dialog").count(), 1);
const forecastRows = await page
  .locator(".forecast-table tbody tr")
  .allTextContents();
assert.ok(forecastRows[0].includes("75"));
assert.ok(forecastRows[2].includes("69"));
await page.keyboard.press("Escape");
assert.equal(await page.getByRole("dialog").count(), 0);
assert.equal(
  await page.evaluate(() => document.activeElement.textContent),
  "Check your resource forecast",
);

async function install(id, name) {
  await role("All hardware").click();
  await page
    .locator(".hardware-list article")
    .filter({
      has: page.getByRole("heading", { name: new RegExp(`^${name}`) }),
    })
    .getByRole("button", { name: "Inspect", exact: true })
    .click();
  await role(`Install ${name.toLowerCase()}`).click();
  const m = await snapshot();
  assert.ok(m.modules[id] >= 2 || ["shelter", "reactor", "moxie"].includes(id));
}
await install("solar", "Solar array");
await install("recycler", "Water recycler");
let m = await snapshot();
assert.equal(m.budget, 16);
assert.equal(m.cargoUsed, 5);
await role("Advance one day").click();
m = await snapshot();
assert.equal(m.turn, 1);
assert.equal(m.resources.energy, 95);
assert.equal(m.resources.water, 70);
await page.reload();
assert.equal((await snapshot()).turn, 1);

// Complete the Moon mission through only user-visible controls.
while ((m = await snapshot()).status === "active") {
  if (m.resources.water < 25 && m.budget >= 18) {
    await role("All hardware").click();
    await role("Supply pack · 18 credits").click();
    m = await snapshot();
  }
  if ([2, 4, 6, 9].includes(m.turn) && !m.resolved.includes(m.turn)) {
    await role("Review mission incident").click();
    await page
      .getByRole("dialog")
      .getByRole("button", {
        name: new RegExp(
          m.turn === 2
            ? "Repair the pipe"
            : m.turn === 4
              ? "Keep the crew inside"
              : m.turn === 6
                ? "Give the crew a recovery day"
                : "Repair the nutrient pump",
        ),
      })
      .click();
  }
  await role("Advance one day").click();
}
assert.equal(m.status, "success");
assert.equal(m.turn, 14);
assert.ok(m.resources.health > 0);
await page.screenshot({
  path: `${output}/mission-completed.png`,
  fullPage: true,
});
await role("Explore your mission journal").click();
assert.ok(
  (await page.locator(".saved-missions").innerText()).includes("Luna Base"),
);
const downloadWait = page.waitForEvent("download");
await role("Export debrief").click();
const file = await downloadWait;
assert.ok(file.suggestedFilename().endsWith(".md"));
await file.saveAs(`${output}/mission-debrief.md`);

// Optional learning checks: mistake feedback, correct answer, saved mastery.
await role("Flight school").click();
await page.getByRole("button", { name: /^A A battery bank/ }).click();
assert.ok(
  (await page.locator(".answer-feedback").innerText()).includes("Let’s think"),
);
await page
  .getByRole("button", { name: /^B A solar array in sunlight/ })
  .click();
assert.ok(
  (await page.locator(".answer-feedback").innerText()).includes(
    "You’ve got it",
  ),
);
await page.reload();
await role("Flight school").click();
assert.ok(
  (await page.locator(".learning-progress").innerText()).includes("1 / 6"),
);
await role("Source library · 14 references").click();
assert.equal(await page.locator(".source-row").count(), 14);
const urls = await page
  .locator(".source-row")
  .evaluateAll((links) => links.map((a) => a.href));
assert.ok(
  urls.every((u) =>
    /spaceappschallenge\.org|(?:^|\.)nasa\.gov/.test(new URL(u).hostname),
  ),
);

// A new Mars mission changes both art and the model. Preserve the Moon record.
await role("New mission").click();
await page.getByRole("button", { name: /^Mars A dusty/ }).click();
await page.getByLabel("Name your outpost").fill("Ares Discovery");
await role("Let’s build something extraordinary").click();
m = await snapshot();
assert.equal(m.destination, "mars");
assert.equal(m.name, "Ares Discovery");
assert.ok(
  (await page.locator(".outpost-scene img").getAttribute("src")).includes(
    "mars",
  ),
);
await role("Check your resource forecast").click();
assert.equal(
  await page.locator(".forecast-energy strong").first().innerText(),
  "16",
);
await role("Close dialog").click();
await install("solar", "Solar array");
await install("recycler", "Water recycler");
while ((m = await snapshot()).status === "active") {
  if (m.resources.water < 25 && m.budget >= 18) {
    await role("All hardware").click();
    await role("Supply pack · 18 credits").click();
    m = await snapshot();
  }
  if ([2, 4, 6, 9].includes(m.turn) && !m.resolved.includes(m.turn)) {
    await role("Review mission incident").click();
    await page
      .getByRole("dialog")
      .getByRole("button", {
        name: new RegExp(
          m.turn === 2
            ? "Repair the pipe"
            : m.turn === 4
              ? "Keep the crew inside"
              : m.turn === 6
                ? "Give the crew a recovery day"
                : "Repair the nutrient pump",
        ),
      })
      .click();
  }
  await role("Advance one sol").click();
}
assert.equal(m.status, "success");
assert.equal(m.turn, 14);
await role("Close dialog").click();
await role("Mission log").click();
assert.equal(await page.locator(".saved-missions tbody tr").count(), 2);

// Reset via the real setup form for clean product screenshots.
await role("New mission").click();
await role("Let’s build something extraordinary").click();
const checks = [];
for (const width of [1440, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  for (const name of ["Mission control", "Flight school", "Mission log"]) {
    await role(name).click();
    await page.evaluate(() => document.fonts.ready);
    const g = await geom();
    assert.ok(
      g.scrollWidth <= g.width,
      `${name} overflow at ${width}: ${JSON.stringify(g)}`,
    );
    assert.equal(g.missing.length, 0);
    checks.push({ width, page: name, ...g });
    if (width === 390 && name === "Mission control")
      await page.screenshot({
        path: `${output}/mission-control-mobile.png`,
        fullPage: true,
      });
  }
  await role("Mission control").click();
  await role("New mission").click();
  let g = await geom();
  assert.ok(g.scrollWidth <= g.width);
  const dialogSize = await page
    .getByRole("dialog")
    .evaluate((d) => ({ client: d.clientWidth, scroll: d.scrollWidth }));
  assert.ok(
    dialogSize.scroll <= dialogSize.client,
    `Setup dialog overflow at ${width}`,
  );
  await role("Close dialog").click();
  await role("Check your resource forecast").click();
  const forecastSize = await page
    .getByRole("dialog")
    .evaluate((d) => ({ client: d.clientWidth, scroll: d.scrollWidth }));
  assert.ok(
    forecastSize.scroll <= forecastSize.client,
    `Forecast dialog overflow at ${width}`,
  );
  await role("Close dialog").click();
}
await page.setViewportSize({ width: 1536, height: 1024 });
await role("Mission control").click();
await page.screenshot({
  path: `${output}/mission-control-desktop.png`,
  fullPage: true,
});
await role("Flight school").click();
await page.screenshot({ path: `${output}/flight-school.png`, fullPage: true });
assert.deepEqual(errors, []);
await writeFile(
  `${output}/checks.json`,
  JSON.stringify(
    {
      passed: true,
      checks,
      errors,
      workflows: [
        "forecast",
        "construction",
        "cargo",
        "daily plan",
        "Moon 14-day completion",
        "Mars 14-sol completion",
        "incidents",
        "persistence",
        "local mission collection",
        "quiz feedback",
        "knowledge persistence",
        "14 sources",
        "Markdown export",
        "keyboard dialog focus",
        "responsive dialogs",
      ],
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    passed: true,
    responsiveChecks: checks.length,
    errors,
    output,
  }),
);
await browser.close();
