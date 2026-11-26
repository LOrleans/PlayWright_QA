import { test, expect } from './fixtures';
import { customer, products } from '../data/testData';

test.describe('Checkout: validações e totais', () => {
  // Pré-condição de todos os cenários: usuário logado com um item no carrinho,
  // na primeira etapa do checkout
  test.beforeEach(async ({ loggedInInventory, checkoutPage }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.goToCart();
    await checkoutPage.startCheckout();
  });

  const missingFields = [
    {
      name: 'o nome',
      firstName: '',
      lastName: customer.lastName,
      zip: customer.zip,
      message: 'First Name is required',
    },
    {
      name: 'o sobrenome',
      firstName: customer.firstName,
      lastName: '',
      zip: customer.zip,
      message: 'Last Name is required',
    },
    {
      name: 'o CEP',
      firstName: customer.firstName,
      lastName: customer.lastName,
      zip: '',
      message: 'Postal Code is required',
    },
  ];

  for (const { name, firstName, lastName, zip, message } of missingFields) {
    test(`Não deve avançar sem preencher ${name}`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillInfoAndContinue(firstName, lastName, zip);

      await expect(checkoutPage.errorMessage).toContainText(message);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }

  test('Deve calcular o total como subtotal mais imposto', async ({ page, checkoutPage }) => {
    await checkoutPage.fillInfoAndContinue(customer.firstName, customer.lastName, customer.zip);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const subtotal = await checkoutPage.getAmount(checkoutPage.subtotalLabel);
    const tax = await checkoutPage.getAmount(checkoutPage.taxLabel);
    const total = await checkoutPage.getAmount(checkoutPage.totalLabel);

    expect(subtotal).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('Deve concluir a compra e limpar o carrinho', async ({ page, checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInfoAndContinue(customer.firstName, customer.lastName, customer.zip);
    await checkoutPage.finishCheckout();

    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
