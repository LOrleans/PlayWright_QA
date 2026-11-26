import { test, expect } from './fixtures';
import { users } from '../data/testData';

test.describe('Login: cenários negativos e logout', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // Cenários orientados a dados: cada linha vira um teste
  const invalidLogins = [
    {
      name: 'senha incorreta',
      username: users.standard.username,
      password: 'senha_errada',
      message: 'Username and password do not match any user in this service',
    },
    {
      name: 'usuário inexistente',
      username: 'usuario_inexistente',
      password: users.standard.password,
      message: 'Username and password do not match any user in this service',
    },
    {
      name: 'usuário bloqueado',
      username: users.locked.username,
      password: users.locked.password,
      message: 'Sorry, this user has been locked out.',
    },
    {
      name: 'usuário vazio',
      username: '',
      password: users.standard.password,
      message: 'Username is required',
    },
    {
      name: 'senha vazia',
      username: users.standard.username,
      password: '',
      message: 'Password is required',
    },
  ];

  for (const { name, username, password, message } of invalidLogins) {
    test(`Não deve permitir login com ${name}`, async ({ page, loginPage }) => {
      await loginPage.doLogin(username, password);

      await expect(loginPage.errorMessage).toContainText(message);
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  }

  test('Deve fazer logout e voltar para a tela de login', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.doLogin(users.standard.username, users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');

    await inventoryPage.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Não deve acessar a tela de produtos sem autenticação', async ({ page, loginPage }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in."
    );
  });
});
