const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  page = await browser.newPage();
  // await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("We can launch a browser", async () => {
  expect(browser).toBeTruthy();
});

test("We can launch a page", async () => {
  expect(page).toBeTruthy();
});

test("The header has the correct text", async () => {
  await page.goto("localhost:3000");
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.goto("localhost:3000");
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  const id = "5f5c1d7d3a9c1a0017c3d4b4";
  const Buffer = require("safe-buffer").Buffer;
  const sessionObject = {
    passport: {
      user: id,
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + sessionString);

  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
  await page.waitFor("a[href='/auth/logout']");
  const text = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
