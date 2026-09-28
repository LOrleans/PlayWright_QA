import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartBackpack: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addBackpackToCart() {
    await this.addToCartBackpack.click();
  }

  async goToCart() {
    await this.cartLink.click()
  }
}