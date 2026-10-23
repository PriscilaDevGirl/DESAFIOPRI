const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { ProgressBarPage } = require("../../src/pages/progress-bar.page");

When("interrompo a barra antes de 25%", async function () {
  await this.homePage.openSectionPage("Widgets", "Progress Bar");
  this.progressBarPage = new ProgressBarPage(this.driver);
  this.stoppedProgress = await this.progressBarPage.startAndStopBefore25();
});

Then("o valor interrompido é menor ou igual a 25%", function () {
  assert.ok(this.stoppedProgress > 0, "The progress bar must have started");
  assert.ok(
    this.stoppedProgress <= 25,
    `The progress bar stopped at ${this.stoppedProgress}%, above 25%`
  );
});

When("retomo a barra até 100% e a reinicio", async function () {
  await this.progressBarPage.resumeTo100AndReset();
});

Then("a barra retorna a zero", async function () {
  assert.equal(await this.progressBarPage.getProgressValue(), 0);
});
