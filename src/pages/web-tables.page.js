const { By, until, Select } = require("selenium-webdriver");

class WebTablesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async openRegistrationForm() {
    const addButton = await this.driver.wait(
      until.elementLocated(By.id("addNewRecordButton")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(addButton), 10_000);
    await addButton.click();
    const modal = await this.driver.wait(
      until.elementLocated(By.css(".modal-content")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(modal), 10_000);
    return modal;
  }

  async setPageSize(size) {
    const select = await this.driver.wait(
      until.elementLocated(By.css("select")),
      10_000
    );
    const pageSize = new Select(select);
    await pageSize.selectByValue(String(size));
  }

  async createRecord(record) {
    const modal = await this.openRegistrationForm();
    await this.fillRecordForm(modal, record);
    await modal.findElement(By.id("submit")).click();
    await this.driver.wait(until.stalenessOf(modal), 10_000);
    await this.waitForRecord(record.email);
  }

  async editRecord(record, updatedFirstName) {
    const row = await this.findRow(record.email);
    await row.findElement(By.css('[id^="edit-record-"]')).click();
    const modal = await this.driver.wait(
      until.elementLocated(By.css(".modal-content")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(modal), 10_000);
    const firstName = await modal.findElement(By.id("firstName"));
    await firstName.clear();
    await firstName.sendKeys(updatedFirstName);
    await modal.findElement(By.id("submit")).click();
    await this.driver.wait(until.stalenessOf(modal), 10_000);
    await this.waitForRecord(record.email);
  }

  async deleteRecord(email) {
    const row = await this.findRow(email);
    await row.findElement(By.css('[id^="delete-record-"]')).click();
    await this.driver.wait(
      async () => (await this.driver.findElements(this.rowLocator(email))).length === 0,
      10_000,
      "The selected record remains in the table"
    );
  }

  async deleteRecordsIfPresent(emails) {
    let deletedCount = 0;
    for (const email of emails) {
      const rows = await this.driver.findElements(this.rowLocator(email));
      if (rows.length === 0) {
        continue;
      }
      await this.deleteRecord(email);
      deletedCount += 1;
    }
    return deletedCount;
  }

  async findRow(email) {
    return this.driver.wait(
      until.elementLocated(this.rowLocator(email)),
      10_000,
      `The record ${email} was not found in the table`
    );
  }

  async getRowValues(email) {
    const row = await this.findRow(email);
    const cells = await row.findElements(By.css("td"));
    return Promise.all(cells.map((cell) => cell.getText()));
  }

  async waitForRecord(email) {
    await this.findRow(email);
  }

  rowLocator(email) {
    return By.xpath(`//tr[td[normalize-space()="${email}"]]`);
  }

  async fillRecordForm(modal, record) {
    const fields = [
      ["firstName", record.firstName],
      ["lastName", record.lastName],
      ["userEmail", record.email],
      ["age", record.age],
      ["salary", record.salary],
      ["department", record.department]
    ];
    for (const [field, value] of fields) {
      await modal.findElement(By.id(field)).sendKeys(value);
    }
  }
}

module.exports = { WebTablesPage };
