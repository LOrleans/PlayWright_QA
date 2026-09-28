import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage'
import { CheckoutPage } from '../pages/CheckoutPage' 

test('Should perform the complete purchase flow (E2E)', async({ page }) => {
  // Initialize all the pages
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Do login
  await loginPage.navigate();
  await loginPage.doLogin('standard_user', 'secret_sauce')

  // Choose the product
  await inventoryPage.addBackpackToCart();
  await inventoryPage.goToCart();

  // Checkout flow
  await checkoutPage.startCheckout();
  await checkoutPage.fillInfoAndContinue('Lucas', 'Orleans', '12345');
  await checkoutPage.finishCheckout();

  // Validation
  const sucessMessage = page.locator('.complete-header')
  await expect(sucessMessage).toHaveText('Thank you for your order!')
})