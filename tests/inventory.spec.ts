import { test, expect } from './fixtures';
import { products } from '../data/testData';

test.describe('Produtos: ordenação e carrinho', () => {
  test('Deve listar os produtos após o login', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.title).toHaveText('Products');
    await expect(loggedInInventory.itemNames).toHaveCount(6);
  });

  test('Deve ordenar os produtos por nome de A a Z', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('az');

    const names = await loggedInInventory.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('Deve ordenar os produtos por nome de Z a A', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('za');

    const names = await loggedInInventory.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('Deve ordenar os produtos por preço, do menor para o maior', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');

    const prices = await loggedInInventory.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Deve ordenar os produtos por preço, do maior para o menor', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('hilo');

    const prices = await loggedInInventory.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('Deve atualizar o contador do carrinho ao adicionar e remover itens', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.cartBadge).toHaveCount(0);

    await loggedInInventory.addToCart(products.backpack);
    await expect(loggedInInventory.cartBadge).toHaveText('1');

    await loggedInInventory.addToCart(products.bikeLight);
    await expect(loggedInInventory.cartBadge).toHaveText('2');

    await loggedInInventory.removeFromCart(products.backpack);
    await expect(loggedInInventory.cartBadge).toHaveText('1');

    await loggedInInventory.removeFromCart(products.bikeLight);
    await expect(loggedInInventory.cartBadge).toHaveCount(0);
  });
});
