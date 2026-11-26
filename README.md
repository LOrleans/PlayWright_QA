# Playwright QA — testes E2E e de API com Page Object Model

[![Playwright Tests](https://github.com/LOrleans/PlayWright_QA/actions/workflows/playwright.yml/badge.svg)](https://github.com/LOrleans/PlayWright_QA/actions/workflows/playwright.yml)

Projeto de estudo e portfólio de automação de testes com [Playwright](https://playwright.dev/) e TypeScript. Os cenários cobrem fluxos de interface (login e compra) e de API, e a interface é organizada com o padrão **Page Object Model (POM)**. Os testes rodam automaticamente no GitHub Actions a cada push e pull request.

## 🎯 O que é testado

| Arquivo | Tipo | Alvo | Cenário |
|---|---|---|---|
| `tests/login.spec.ts` | E2E | [SauceDemo](https://www.saucedemo.com/) | Login com usuário válido e verificação da página de produtos |
| `tests/checkout.spec.ts` | E2E | [SauceDemo](https://www.saucedemo.com/) | Fluxo completo de compra: login, adicionar ao carrinho, checkout e mensagem de sucesso |
| `tests/api.spec.ts` | API | [Restful Booker](https://restful-booker.herokuapp.com/) | Criação de reserva (POST), com validação de status e do corpo da resposta |

Os testes de interface e de API usam sites públicos criados para prática de automação, então não é preciso subir nenhuma aplicação local.

## 🧱 Estrutura e padrão de projeto

```
.
├── pages/                  # Page Objects (ações e locators de cada página)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CheckoutPage.ts
├── tests/                  # Cenários de teste (as verificações ficam aqui)
│   ├── login.spec.ts
│   ├── checkout.spec.ts
│   └── api.spec.ts
├── playwright.config.ts    # Configuração (navegadores, retries, trace, relatório)
└── .github/workflows/      # Pipeline de CI
```

Decisão de projeto: as classes em `pages/` só **executam ações** (navegar, preencher, clicar) e expõem locators. As **verificações (`expect`) ficam nos testes**, o que mantém os Page Objects reutilizáveis e os cenários legíveis.

## ⚙️ Configuração

- Navegadores: Chromium, Firefox e WebKit
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
| `npm run test:chromium` | Roda só no Chromium (mais rápido) |
| `npm run test:ui` | Abre o modo interativo do Playwright |
| `npm run report` | Abre o último relatório HTML |

Para rodar um arquivo específico: `npx playwright test tests/login.spec.ts`.

## 🔄 Integração contínua

O workflow `.github/workflows/playwright.yml` instala as dependências e os navegadores, roda a suíte e envia o relatório como artefato. Para ver o relatório de uma execução, abra a aba **Actions**, escolha a execução e baixe o artefato `playwright-report`.

## 🗺️ Próximos passos

- Mais cenários de login (usuário bloqueado, credenciais inválidas) e de carrinho
- Testes de API para consulta, atualização e remoção de reservas
- Documentar o plano de testes com os casos, pré-condições e resultados esperados
