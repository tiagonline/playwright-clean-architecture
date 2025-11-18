import { type Locator, type Page } from '@playwright/test';
export class InventoryPage {
  readonly page: Page;
  readonly backpackAddButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }
  async addBackpackToCart() { await this.backpackAddButton.click(); }
  async goToCart() { await this.cartLink.click(); }
}