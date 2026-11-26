import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async removeItem(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
