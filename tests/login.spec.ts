import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'

// Definição do cenários
test('Deve fazer login com sucesso na SauceDemo', async ({ page }) => {
  // Instanciar a página de login
  const loginPage = new LoginPage(page);

  // Métodos de ação definidos na classe
  await loginPage.navigate();
  await loginPage.doLogin('standard_user', 'secret_sauce')

  // Verificação mantém no arquivo de teste, nunca dentro da classe.
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
})












// Código inicial -----------------------

// // Definição do cenários
// test('Deve fazer login com sucesso na SauceDemo', async ({ page }) => {
//   // 1. Ação: Ir até a página
//   await page.goto('https://www.saucedemo.com/');

//   // 2. Ação: Preencher os campos
//   await page.locator('[data-test="username"]').fill('standard_user');
//   await page.locator('[data-test="password"]').fill('secret_sauce');

//   // 3. Ação: Clicar no botão de login
//   await page.locator('[data-test="login-button"]').click();

//   // 4. Validação: Garantir que fomos redirecionados para a página correta.
//   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  
//   const title = page.locator('.title');
//   await expect(title).toHaveText('Products');
// })

// --------------------------------------