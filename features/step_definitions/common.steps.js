const { Given } = require("@cucumber/cucumber");
const { HomePage } = require("../../src/pages/home.page");

Given("que estou na página inicial do DemoQA", async function () {
  this.homePage = new HomePage(this.driver);
  await this.homePage.open();
});
