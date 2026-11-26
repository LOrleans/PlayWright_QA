# Playwright QA — testes E2E e de API com Page Object Model

[![Playwright Tests](https://github.com/LOrleans/PlayWright_QA/actions/workflows/playwright.yml/badge.svg)](https://github.com/LOrleans/PlayWright_QA/actions/workflows/playwright.yml)

Projeto de estudo e portfólio de automação de testes com [Playwright](https://playwright.dev/) e TypeScript. Os cenários cobrem fluxos de interface (login e compra) e de API, e a interface é organizada com o padrão **Page Object Model (POM)**. Os testes rodam automaticamente no GitHub Actions a cada push e pull request.

## 🎯 O que é testado

São 31 cenários: 23 de interface e 8 de API. Os de interface rodam em 3 navegadores (69 execuções) e os de API rodam uma vez.

| Arquivo | Tipo | Alvo | Cenários |
|---|---|---|---|
| `tests/login.spec.ts` | E2E | [SauceDemo](https://www.saucedemo.com/) | Login com usuário válido |
| `tests/login-negative.spec.ts` | E2E | SauceDemo | Senha incorreta, usuário inexistente, usuário bloqueado, campos vazios, logout e acesso sem autenticação |
| `tests/inventory.spec.ts` | E2E | SauceDemo | Listagem, 4 ordenações e contador do carrinho |
| `tests/cart.spec.ts` | E2E | SauceDemo | Itens no carrinho, remoção e continuidade da compra |
| `tests/checkout.spec.ts` | E2E | SauceDemo | Fluxo completo de compra, do login à confirmação |
| `tests/checkout-validation.spec.ts` | E2E | SauceDemo | Campos obrigatórios, total igual a subtotal mais imposto e conclusão da compra |
| `tests/api.spec.ts` | API | [Restful Booker](https://restful-booker.herokuapp.com/) | Criação de reserva (POST) |
| `tests/api-booking.spec.ts` | API | Restful Booker | Consulta, 404, atualização com e sem token, exclusão e autenticação |

Os casos, com pré-condições e resultados esperados, estão em [`docs/plano-de-testes.md`](docs/plano-de-testes.md). Os alvos são sites públicos criados para prática de automação, então não é preciso subir nenhuma aplicação local.

## 🧱 Estrutura e padrão de projeto

```
.
├── pages/                  # Page Objects (ações e locators de cada página)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── api/                    # Cliente das chamadas da API (criar, consultar, atualizar, excluir)
│   └── bookingClient.ts
├── data/                   # Dados de teste (usuários, produtos, cliente)
│   └── testData.ts
├── tests/                  # Cenários de teste (as verificações ficam aqui)
│   ├── fixtures.ts         # Page Objects e login prontos para uso nos testes
│   └── *.spec.ts
├── docs/
│   └── plano-de-testes.md  # Plano de testes com os casos e resultados esperados
├── playwright.config.ts    # Configuração (projetos, retries, trace, relatório)
└── .github/workflows/      # Pipeline de CI
```

Decisões de projeto:

- As classes em `pages/` só **executam ações** (navegar, preencher, clicar) e expõem locators. As **verificações (`expect`) ficam nos testes**, o que mantém os Page Objects reutilizáveis e os cenários legíveis.
- **Fixtures** (`tests/fixtures.ts`) entregam os Page Objects e o login prontos, sem repetir a preparação em cada teste.
- Cenários negativos de login e de checkout são **orientados a dados**: uma tabela de entradas gera um teste por linha.
- Cada teste de API **cria a própria reserva**, então os testes não dependem uns dos outros.

## ⚙️ Configuração

- Projetos: `chromium`, `firefox` e `webkit` para interface, e `api` (sem navegador) para os testes de API
- No CI: 2 tentativas por teste (`retries`), execução com 1 worker e `forbidOnly` ativo
- Trace coletado na primeira nova tentativa de um teste que falhou
- Relatório HTML gerado em `playwright-report/` e publicado como artefato do workflow por 30 dias

## 🚀 Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org/) LTS.

```bash
git clone https://github.com/LOrleans/PlayWright_QA.git
cd PlayWright_QA
npm ci
npx playwright install --with-deps
npm test
```

| Comando | Descrição |
|---|---|
| `npm test` | Roda todos os testes em todos os navegadores |
| `npm run test:chromium` | Roda os testes de interface só no Chromium (mais rápido) |
| `npm run test:api` | Roda só os testes de API |
| `npm run test:ui` | Abre o modo interativo do Playwright |
| `npm run report` | Abre o último relatório HTML |

Para rodar um arquivo específico: `npx playwright test tests/login.spec.ts`.

## 🔄 Integração contínua

O workflow `.github/workflows/playwright.yml` instala as dependências e os navegadores, roda a suíte e envia o relatório como artefato. Para ver o relatório de uma execução, abra a aba **Actions**, escolha a execução e baixe o artefato `playwright-report`.

## 🗺️ Próximos passos

- Cobrir os usuários `problem_user` e `performance_glitch_user` da SauceDemo
- Testes visuais com `toHaveScreenshot`
- Gerar o relatório publicado do CI em uma página do GitHub Pages
