const { World, setDefaultTimeout, setWorldConstructor } = require("@cucumber/cucumber");
const { DemoQaClient } = require("../src/api/demoqa-client");

setDefaultTimeout(30_000);

class TestWorld extends World {
  constructor(options) {
    super(options);
    this.api = new DemoQaClient();
    this.credentials = null;
    this.accessToken = null;
    this.userId = null;
    this.selectedBooks = [];
  }
}

setWorldConstructor(TestWorld);
