import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../data/testData';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  // Usuário já autenticado na tela de produtos
  loggedInInventory: InventoryPage;
};

// Fixtures: cada teste recebe os Page Objects prontos, sem repetir a criação
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInInventory: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.navigate();
    await loginPage.doLogin(users.standard.username, users.standard.password);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
