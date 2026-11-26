import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page){
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]')
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.finishButton = page.locator('[data-test="finish"]')
    this.errorMessage = page.locator('[data-test="error"]')
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]')
    this.taxLabel = page.locator('[data-test="tax-label"]')
    this.totalLabel = page.locator('[data-test="total-label"]')
  }

  async startCheckout(){
    await this.checkoutButton.click();
  }

  async fillInfoAndContinue(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }

  async finishCheckout(){
    await this.finishButton.click();
  }

  // Lê um valor em dólar de um rótulo como "Total: $32.39"
  async getAmount(label: Locator): Promise<number> {
    const text = await label.innerText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}
