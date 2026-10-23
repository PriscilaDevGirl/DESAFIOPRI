const { By, until } = require("selenium-webdriver");

const ASCENDING_ORDER = ["One", "Two", "Three", "Four", "Five", "Six"];
const LIST_ITEMS = By.css("#demo-tabpane-list .list-group-item");

class SortablePage {
  constructor(driver) {
    this.driver = driver;
  }

  async getListOrder() {
    await this.driver.wait(
      async () => {
        const items = await this.driver.findElements(LIST_ITEMS);
        let visibleCount = 0;
        for (const item of items) {
          if (await item.isDisplayed()) {
            visibleCount += 1;
          }
        }
        return visibleCount === ASCENDING_ORDER.length;
      },
      10_000,
      "The sortable list did not render all six items"
    );

    const items = await this.driver.findElements(LIST_ITEMS);
    const visibleItems = [];
    for (const item of items) {
      if (await item.isDisplayed()) {
        visibleItems.push((await item.getText()).trim());
      }
    }
    return visibleItems;
  }

  async dragItemBefore(itemName, targetName) {
    const source = await this.findListItem(itemName);
    const target = await this.findListItem(targetName);
    await this.driver.actions().dragAndDrop(source, target).perform();
  }

  async sortAscending() {
    const maxMoves = ASCENDING_ORDER.length * ASCENDING_ORDER.length;
    for (let move = 0; move < maxMoves; move += 1) {
      const order = await this.getListOrder();
      if (this.hasAscendingOrder(order)) {
        return order;
      }

      const firstMismatch = order.findIndex(
        (item, index) => item !== ASCENDING_ORDER[index]
      );
      if (firstMismatch < 0) {
        throw new Error("The sortable list does not match the expected item set");
      }

      const itemToMove = ASCENDING_ORDER[firstMismatch];
      await this.dragItemBefore(itemToMove, order[firstMismatch]);
      await this.driver.wait(
        async () => {
          const currentOrder = await this.getListOrder();
          return currentOrder.some((item, index) => item !== order[index]);
        },
        5_000,
        `Dragging ${itemToMove} did not change the list order`
      );
    }

    throw new Error("The sortable list could not be arranged in ascending order");
  }

  async findListItem(name) {
    const item = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[@id="demo-tabpane-list"]//*[contains(@class,"list-group-item") and normalize-space()="${name}"]`
        )
      ),
      10_000,
      `The sortable item ${name} was not found`
    );
    await this.driver.wait(until.elementIsVisible(item), 10_000);
    return item;
  }

  hasAscendingOrder(order) {
    return (
      order.length === ASCENDING_ORDER.length &&
      order.every((item, index) => item === ASCENDING_ORDER[index])
    );
  }
}

module.exports = { SortablePage, ASCENDING_ORDER };
