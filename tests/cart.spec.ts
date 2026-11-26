import { test, expect } from './fixtures';
import { products } from '../data/testData';

test.describe('Carrinho', () => {
  test('Deve exibir no carrinho os itens adicionados', async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.boltShirt);
    await loggedInInventory.goToCart();

    await expect(cartPage.items).toHaveCount(2);
    const names = await cartPage.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bolt T-Shirt');
  });

  test('Deve remover um item direto no carrinho', async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.bikeLight);
    await loggedInInventory.goToCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Bike Light']);
  });

  test('Deve manter os itens ao voltar para a lista de produtos', async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.goToCart();

    await cartPage.continueShopping();

    await expect(loggedInInventory.cartBadge).toHaveText('1');
  });
});
