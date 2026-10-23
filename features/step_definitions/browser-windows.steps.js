const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { BrowserWindowsPage } = require("../../src/pages/browser-windows.page");

When("abro Browser Windows e solicito uma nova janela", async function () {
  await this.homePage.openSectionPage("Alerts, Frame & Windows", "Browser Windows");
  this.browserWindowsPage = new BrowserWindowsPage(this.driver);
  this.originalWindow = await this.driver.getWindowHandle();
  const { existingHandles, newHandle } =
    await this.browserWindowsPage.openNewWindow();
  assert.equal(
    existingHandles.length + 1,
    (await this.driver.getAllWindowHandles()).length,
    "Exactly one new browser window must be opened"
  );
  this.newWindow = newHandle;
  await this.driver.switchTo().window(this.newWindow);
  await this.browserWindowsPage.waitForSampleMessage();
});

Then("a nova janela exibe a mensagem de exemplo e é fechada", async function () {
  const message = await this.browserWindowsPage.getSampleMessage();
  assert.ok(
    message.includes("This is a sample page"),
    "The new window must display the expected sample message"
  );

  await this.browserWindowsPage.closeAndReturn(
    this.originalWindow,
    this.newWindow
  );
  assert.equal(await this.driver.getWindowHandle(), this.originalWindow);
  assert.equal((await this.driver.getAllWindowHandles()).length, 1);
});
