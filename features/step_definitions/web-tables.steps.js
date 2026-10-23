const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const { HomePage } = require("../../src/pages/home.page");
const { WebTablesPage } = require("../../src/pages/web-tables.page");

When("crio e edito um registro único em Web Tables", async function () {
  await this.homePage.openSectionPage("Elements", "Web Tables");
  this.webTablesPage = new WebTablesPage(this.driver);
  const unique = randomBytes(6).toString("hex");
  this.tableRecord = {
    firstName: `QA${unique}`,
    lastName: "Automation",
    email: `qa.${unique}@example.com`,
    age: "31",
    salary: "85000",
    department: "QA Automation"
  };
  this.updatedFirstName = `Edit${unique}`;

  await this.webTablesPage.createRecord(this.tableRecord);
  await this.webTablesPage.editRecord(this.tableRecord, this.updatedFirstName);
});

Then("os valores atualizados aparecem na tabela", async function () {
  const values = await this.webTablesPage.getRowValues(this.tableRecord.email);
  assert.equal(values[0], this.updatedFirstName);
  assert.equal(values[1], this.tableRecord.lastName);
  assert.equal(values[2], this.tableRecord.age);
  assert.equal(values[3], this.tableRecord.email);
  assert.equal(values[4], this.tableRecord.salary);
  assert.equal(values[5], this.tableRecord.department);
});

When("excluo o registro criado", async function () {
  await this.webTablesPage.deleteRecord(this.tableRecord.email);
});

Then("o registro não aparece mais na tabela", async function () {
  const rows = await this.driver.findElements(
    this.webTablesPage.rowLocator(this.tableRecord.email)
  );
  assert.equal(rows.length, 0, "The created record must be absent after deletion");
});

When(
  "crio doze registros dinâmicos em Web Tables",
  { timeout: 90_000 },
  async function () {
    await this.homePage.openSectionPage("Elements", "Web Tables");
    this.webTablesPage = new WebTablesPage(this.driver);
    await this.webTablesPage.setPageSize(50);

    this.bonusRecords = [];
    for (let index = 0; index < 12; index += 1) {
      const unique = randomBytes(6).toString("hex");
      const record = {
        firstName: `QA${unique}`,
        lastName: "Bonus",
        email: `qa${unique}@test.com`,
        age: String(20 + (index % 30)),
        salary: String(50_000 + index),
        department: "QA Bonus"
      };
      this.bonusRecords.push(record);
      await this.webTablesPage.createRecord(record);
    }
  }
);

Then("os doze registros criados estão visíveis", async function () {
  assert.equal(this.bonusRecords.length, 12);
  for (const record of this.bonusRecords) {
    await this.webTablesPage.findRow(record.email);
  }
});

When(
  "excluo todos os registros criados",
  { timeout: 90_000 },
  async function () {
    this.bonusDeleteActions = await this.webTablesPage.deleteRecordsIfPresent(
      this.bonusRecords.map((record) => record.email)
    );
  }
);

Then("nenhum registro do teste permanece na tabela", async function () {
  assert.ok(
    this.bonusDeleteActions > 0,
    "At least one delete action must be performed"
  );
  for (const record of this.bonusRecords) {
    const rows = await this.driver.findElements(
      this.webTablesPage.rowLocator(record.email)
    );
    assert.equal(rows.length, 0, `The test record ${record.email} must be removed`);
  }
});
