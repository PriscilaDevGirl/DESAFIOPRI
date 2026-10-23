const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { SortablePage, ASCENDING_ORDER } = require("../../src/pages/sortable.page");

When("organizo os elementos da lista por arraste", async function () {
  await this.homePage.openSectionPage("Interactions", "Sortable");
  this.sortablePage = new SortablePage(this.driver);
  const initialOrder = await this.sortablePage.getListOrder();

  if (this.sortablePage.hasAscendingOrder(initialOrder)) {
    await this.sortablePage.dragItemBefore("Six", "One");
    const perturbedOrder = await this.sortablePage.getListOrder();
    assert.notDeepEqual(
      perturbedOrder,
      initialOrder,
      "A real drag-and-drop must change the initially sorted list"
    );
  }

  this.sortedOrder = await this.sortablePage.sortAscending();
});

Then("a lista aparece na ordem crescente esperada", function () {
  assert.deepEqual(this.sortedOrder, ASCENDING_ORDER);
});
