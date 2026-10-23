const { By, until } = require("selenium-webdriver");

class BrowserWindowsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async openNewWindow() {
    const existingHandles = await this.driver.getAllWindowHandles();
    const newWindowButton = await this.driver.wait(
      until.elementLocated(By.id("windowButton")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(newWindowButton), 10_000);
    await newWindowButton.click();

    const handles = await this.driver.wait(
      async () => {
        const currentHandles = await this.driver.getAllWindowHandles();
        return currentHandles.length > existingHandles.length ? currentHandles : false;
      },
      10_000,
      "The new browser window did not open"
    );
    const newHandle = handles.find((handle) => !existingHandles.includes(handle));
    if (!newHandle) {
      throw new Error("The browser opened no distinct window handle");
    }

    return { existingHandles, newHandle };
  }

  async waitForSampleMessage() {
    const body = await this.driver.findElement(By.css("body"));
    await this.driver.wait(
      until.elementTextContains(body, "This is a sample page"),
      10_000
    );
  }

  async getSampleMessage() {
    return this.driver.findElement(By.css("body")).getText();
  }

  async closeAndReturn(originalHandle, newHandle) {
    await this.driver.switchTo().window(newHandle);
    await this.driver.close();
    await this.driver.switchTo().window(originalHandle);
    await this.driver.wait(
      async () => (await this.driver.getAllWindowHandles()).length === 1,
      10_000,
      "The sample window was not closed"
    );
  }
}

module.exports = { BrowserWindowsPage };
