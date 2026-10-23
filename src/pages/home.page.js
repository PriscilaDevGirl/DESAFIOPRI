const { By, until } = require("selenium-webdriver");

class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    const baseUrl = process.env.BASE_URL || "https://demoqa.com";
    await this.driver.get(baseUrl);
    await this.driver.wait(until.elementLocated(By.css('a[href="/forms"]')), 10_000);
  }

  async openSectionPage(sectionName, pageName) {
    await this.driver.findElement(By.linkText(sectionName)).click();
    const pageLink = await this.driver.wait(
      until.elementLocated(By.linkText(pageName)),
      10_000
    );
    await pageLink.click();
  }
}

module.exports = { HomePage };
