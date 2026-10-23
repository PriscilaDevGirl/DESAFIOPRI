const { After, Before } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

Before({ tags: "@ui" }, async function () {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== "false") {
    options.addArguments("--headless=new");
  }
  options.addArguments("--window-size=1920,1080", "--no-sandbox", "--disable-dev-shm-usage");

  this.driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  await this.driver.manage().setTimeouts({ implicit: 0 });
});

After({ tags: "@ui" }, async function (scenario) {
  if (!this.driver) {
    return;
  }

  try {
    if (scenario.result?.status === "FAILED") {
      const screenshot = await this.driver.takeScreenshot();
      await this.attach(Buffer.from(screenshot, "base64"), "image/png");
    }
  } finally {
    await this.driver.quit();
  }
});

After({ tags: "@api" }, async function () {
  if (!this.userId) {
    return;
  }

  if (!this.accessToken && this.credentials) {
    const tokenResponse = await this.api.generateToken(this.credentials);
    assert.equal(tokenResponse.status, 200, "Token generation for cleanup must succeed");
    this.accessToken = tokenResponse.data?.token;
  }

  assert.ok(this.accessToken, "A bearer token is required to clean up the test account");
  const response = await this.api.deleteUser(this.userId, this.accessToken);
  assert.ok(
    [200, 204].includes(response.status),
    "The synthetic test account must be deleted after the scenario"
  );
});
