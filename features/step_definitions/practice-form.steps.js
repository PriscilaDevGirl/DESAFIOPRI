const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { randomInt, randomBytes } = require("node:crypto");
const { HomePage } = require("../../src/pages/home.page");
const { PracticeFormPage } = require("../../src/pages/practice-form.page");

Given("dados sintéticos completos para o formulário de prática", function () {
  const unique = randomBytes(4).toString("hex");
  this.student = {
    firstName: `QA${unique}`,
    lastName: "Student",
    email: `qa.${unique}.${Date.now()}@example.com`,
    mobile: String(randomInt(1_000_000_000, 10_000_000_000)),
    dateOfBirth: "10 Sep 1995",
    subject: "Maths",
    address: `Test address ${unique}`,
    state: "NCR",
    city: "Delhi"
  };
});

When("envio o formulário Practice Form", async function () {
  const homePage = new HomePage(this.driver);
  await homePage.open();
  await homePage.openSectionPage("Forms", "Practice Form");

  this.practiceFormPage = new PracticeFormPage(this.driver);
  await this.practiceFormPage.fillAndSubmit(this.student);
});

Then("a confirmação deve mostrar os dados enviados", async function () {
  const confirmation = await this.practiceFormPage.confirmationText();
  for (const expectedValue of [
    `${this.student.firstName} ${this.student.lastName}`,
    this.student.email,
    "Female",
    this.student.mobile,
    "10 September,1995",
    this.student.subject,
    "Reading",
    "student-document.txt",
    this.student.address,
    `${this.student.state} ${this.student.city}`
  ]) {
    assert.ok(
      confirmation.includes(expectedValue),
      `The confirmation must include "${expectedValue}"`
    );
  }
});

Then("a confirmação é fechada", async function () {
  await this.practiceFormPage.closeConfirmation();
});
