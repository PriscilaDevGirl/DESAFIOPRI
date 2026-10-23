const path = require("node:path");
const { By, Key, until } = require("selenium-webdriver");

class PracticeFormPage {
  constructor(driver) {
    this.driver = driver;
  }

  async fillAndSubmit(student) {
    const firstName = await this.driver.wait(
      until.elementLocated(By.id("firstName")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(firstName), 10_000);
    await firstName.sendKeys(student.firstName);
    await this.driver.findElement(By.id("lastName")).sendKeys(student.lastName);
    await this.driver.findElement(By.id("userEmail")).sendKeys(student.email);
    await this.driver.findElement(By.css('label[for="gender-radio-2"]')).click();
    await this.driver.findElement(By.id("userNumber")).sendKeys(student.mobile);

    const dateOfBirth = this.driver.findElement(By.id("dateOfBirthInput"));
    await dateOfBirth.sendKeys(Key.chord(Key.CONTROL, "a"), student.dateOfBirth);
    await this.driver.wait(
      async () => (await dateOfBirth.getAttribute("value")) === student.dateOfBirth,
      3_000,
      "The date-of-birth field did not accept the generated value"
    );
    await dateOfBirth.sendKeys(Key.ESCAPE);

    const subject = this.driver.findElement(By.id("subjectsInput"));
    await subject.sendKeys(student.subject);
    const subjectOption = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//*[@role="option" and normalize-space()="${student.subject}"]`)
      ),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(subjectOption), 10_000);
    await subjectOption.click();
    await this.driver.findElement(By.css('label[for="hobbies-checkbox-2"]')).click();
    await this.driver
      .findElement(By.id("uploadPicture"))
      .sendKeys(path.resolve(__dirname, "../../test-data/student-document.txt"));
    await this.driver
      .findElement(By.id("currentAddress"))
      .sendKeys(student.address);

    const selects = await this.driver.findElements(
      By.css('input[id^="react-select-"][id$="-input"]')
    );
    await selects[0].sendKeys(student.state, Key.ENTER);
    await selects[1].sendKeys(student.city, Key.ENTER);

    // Keyboard activation remains available when the site's footer covers the button.
    await this.driver.findElement(By.id("submit")).sendKeys(Key.ENTER);
    const modal = await this.driver.wait(
      until.elementLocated(By.css(".modal-content")),
      10_000
    );
    await this.driver.wait(until.elementIsVisible(modal), 10_000);
  }

  async confirmationText() {
    const modal = await this.driver.findElement(By.css(".modal-content"));
    return modal.getText();
  }

  async closeConfirmation() {
    const modal = await this.driver.findElement(By.css(".modal-content"));
    await this.driver.actions().sendKeys(Key.ESCAPE).perform();
    await this.driver.wait(until.stalenessOf(modal), 10_000);
  }
}

module.exports = { PracticeFormPage };
