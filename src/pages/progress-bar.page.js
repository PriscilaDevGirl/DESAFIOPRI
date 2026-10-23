const { By, until } = require("selenium-webdriver");

class ProgressBarPage {
  constructor(driver) {
    this.driver = driver;
  }

  async startAndStopBefore25() {
    const startButton = await this.driver.wait(
      until.elementLocated(By.id("startStopButton")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(startButton), 10_000);
    await startButton.click();

    await this.driver.wait(
      async () => (await this.getProgressValue()) >= 15,
      10_000,
      "The progress bar did not begin advancing",
      25
    );
    const stopButton = await this.driver.findElement(By.id("startStopButton"));
    await stopButton.click();
    await this.driver.wait(
      async () => (await stopButton.getText()) === "Start",
      5_000,
      "The progress bar did not stop"
    );

    return this.getProgressValue();
  }

  async resumeTo100AndReset() {
    const startButton = await this.driver.findElement(By.id("startStopButton"));
    await startButton.click();
    await this.driver.wait(
      async () => (await this.getProgressValue()) === 100,
      20_000,
      "The progress bar did not reach 100%",
      50
    );

    const resetButton = await this.driver.wait(
      until.elementLocated(By.id("resetButton")),
      5_000
    );
    await resetButton.click();
    await this.driver.wait(
      async () => (await this.getProgressValue()) === 0,
      5_000,
      "The progress bar did not reset to zero"
    );
  }

  async getProgressValue() {
    const progressBar = await this.driver.findElement(
      By.css('[role="progressbar"]')
    );
    return Number(await progressBar.getAttribute("aria-valuenow"));
  }
}

module.exports = { ProgressBarPage };
