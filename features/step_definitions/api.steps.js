const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");

Given("um usuário sintético com credenciais válidas", function () {
  const unique = randomBytes(6).toString("hex");
  this.credentials = {
    userName: `qa_${Date.now()}_${unique}`,
    password: `Q${randomBytes(8).toString("hex")}!9`
  };
});

When("a conta é criada", async function () {
  const created = await this.api.createUser(this.credentials);
  assert.equal(created.status, 201, "Creating a new account must return HTTP 201");
  this.userId = created.data?.userID || created.data?.userId;
  assert.ok(this.userId, "The account response must include the generated user ID");
});

When("um token de acesso é gerado", async function () {
  const tokenResponse = await this.api.generateToken(this.credentials);
  assert.equal(tokenResponse.status, 200, "Generating an access token must return HTTP 200");
  this.accessToken = tokenResponse.data?.token;
  assert.ok(this.accessToken, "The token response must include a bearer token");
});

Then("a conta deve estar autorizada", async function () {
  const response = await this.api.authorize(this.credentials);
  assert.equal(response.status, 200, "Authorization must return HTTP 200");
  assert.equal(response.data, true, "The newly created account must be authorized");
});

When("dois livros disponíveis são associados à conta", async function () {
  const catalogResponse = await this.api.listBooks();
  assert.equal(catalogResponse.status, 200, "Listing the book catalog must return HTTP 200");
  const catalog = catalogResponse.data?.books;
  assert.ok(Array.isArray(catalog), "The catalog response must contain a books array");

  this.selectedBooks = catalog.slice(0, 2);
  assert.equal(this.selectedBooks.length, 2, "The catalog must contain at least two books");
  assert.ok(
    this.selectedBooks.every((book) => typeof book.isbn === "string" && book.isbn.length > 0),
    "Each selected catalog book must have an ISBN"
  );
  assert.notEqual(
    this.selectedBooks[0].isbn,
    this.selectedBooks[1].isbn,
    "The selected books must be distinct"
  );

  const response = await this.api.addBooks(
    this.userId,
    this.selectedBooks.map((book) => book.isbn),
    this.accessToken
  );
  assert.equal(response.status, 201, "Associating books must return HTTP 201");
});

Then("os detalhes da conta devem conter exatamente os dois livros escolhidos", async function () {
  const response = await this.api.getUser(this.userId, this.accessToken);
  assert.equal(response.status, 200, "Reading account details must return HTTP 200");
  assert.equal(
    response.data?.userID || response.data?.userId,
    this.userId,
    "The account details must belong to the created account"
  );

  const actualIsbns = response.data?.books?.map((book) => book.isbn).sort();
  const expectedIsbns = this.selectedBooks.map((book) => book.isbn).sort();
  assert.deepEqual(
    actualIsbns,
    expectedIsbns,
    "The account must contain exactly the two selected books"
  );
});
