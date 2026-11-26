# Plano de testes

Documento de planejamento da suíte automatizada deste repositório. Descreve o que é testado, como, com quais dados e quais são as limitações conhecidas.

## 1. Objetivo e escopo

Validar de forma automatizada os principais fluxos de dois sistemas públicos de demonstração:

| Sistema | Tipo | Áreas cobertas |
|---|---|---|
| [SauceDemo](https://www.saucedemo.com/) | Interface web (E2E) | Login, produtos, carrinho e checkout |
| [Restful Booker](https://restful-booker.herokuapp.com/) | API REST | Autenticação e CRUD de reservas |

Fora do escopo: testes de desempenho, acessibilidade e compatibilidade visual.

## 2. Estratégia

- **Page Object Model:** as classes em `pages/` expõem locators e ações. As verificações (`expect`) ficam nos testes.
- **Fixtures:** `tests/fixtures.ts` entrega os Page Objects prontos e a fixture `loggedInInventory`, que já faz o login.
- **Testes orientados a dados:** cenários negativos de login e de checkout usam uma tabela de entradas, e cada linha gera um teste.
- **Independência:** cada teste de API cria a própria reserva, sem depender da ordem de execução nem de dados de outros testes.
- **Execução:** testes de interface rodam em Chromium, Firefox e WebKit. Testes de API rodam uma única vez, no projeto `api`, sem navegador.
- **CI:** o workflow `.github/workflows/playwright.yml` roda a suíte a cada push e pull request e publica o relatório HTML.

## 3. Dados de teste

| Dado | Valor | Origem |
|---|---|---|
| Usuário válido | `standard_user` / `secret_sauce` | Exibido na página de login da SauceDemo |
| Usuário bloqueado | `locked_out_user` / `secret_sauce` | Exibido na página de login da SauceDemo |
| Cliente no checkout | Lucas Orleans, CEP 12345 | Fictício, em `data/testData.ts` |
| Credenciais da API | `admin` / `password123` | Documentação do Restful Booker |

## 4. Casos de teste

### 4.1 Login (`tests/login.spec.ts`, `tests/login-negative.spec.ts`)

| ID | Cenário | Resultado esperado | Arquivo |
|---|---|---|---|
| LOGIN-01 | Login com usuário e senha válidos | Abre a tela de produtos, com o título "Products" | `login.spec.ts` |
| LOGIN-02 | Login com senha incorreta | Mensagem "Username and password do not match any user in this service" e permanece no login | `login-negative.spec.ts` |
| LOGIN-03 | Login com usuário inexistente | Mesma mensagem do LOGIN-02 | `login-negative.spec.ts` |
| LOGIN-04 | Login com usuário bloqueado | Mensagem "Sorry, this user has been locked out." | `login-negative.spec.ts` |
| LOGIN-05 | Login sem informar o usuário | Mensagem "Username is required" | `login-negative.spec.ts` |
| LOGIN-06 | Login sem informar a senha | Mensagem "Password is required" | `login-negative.spec.ts` |
| LOGIN-07 | Logout pelo menu | Volta para a tela de login | `login-negative.spec.ts` |
| LOGIN-08 | Acessar `/inventory.html` sem estar logado | Redireciona para o login com mensagem de acesso restrito | `login-negative.spec.ts` |

### 4.2 Produtos (`tests/inventory.spec.ts`)

Pré-condição: usuário logado.

| ID | Cenário | Resultado esperado |
|---|---|---|
| PROD-01 | Listar produtos após o login | 6 produtos exibidos |
| PROD-02 | Ordenar por nome, A a Z | Nomes em ordem alfabética crescente |
| PROD-03 | Ordenar por nome, Z a A | Nomes em ordem alfabética decrescente |
| PROD-04 | Ordenar por preço, menor para maior | Preços em ordem crescente |
| PROD-05 | Ordenar por preço, maior para menor | Preços em ordem decrescente |
| PROD-06 | Adicionar e remover itens | O contador do carrinho acompanha cada ação e some quando fica vazio |

### 4.3 Carrinho (`tests/cart.spec.ts`)

Pré-condição: usuário logado.

| ID | Cenário | Resultado esperado |
|---|---|---|
| CART-01 | Abrir o carrinho com 2 itens adicionados | Os 2 itens aparecem, com os nomes corretos |
| CART-02 | Remover um item dentro do carrinho | Só o outro item permanece |
| CART-03 | Voltar à lista de produtos pelo carrinho | O contador mantém a quantidade de itens |

### 4.4 Checkout (`tests/checkout.spec.ts`, `tests/checkout-validation.spec.ts`)

Pré-condição: usuário logado, com um item no carrinho, na etapa de dados do cliente (exceto CHK-01).

| ID | Cenário | Resultado esperado | Arquivo |
|---|---|---|---|
| CHK-01 | Fluxo completo de compra, do login à confirmação | Mensagem "Thank you for your order!" | `checkout.spec.ts` |
| CHK-02 | Continuar sem informar o nome | Mensagem "First Name is required" e permanece na etapa 1 | `checkout-validation.spec.ts` |
| CHK-03 | Continuar sem informar o sobrenome | Mensagem "Last Name is required" e permanece na etapa 1 | `checkout-validation.spec.ts` |
| CHK-04 | Continuar sem informar o CEP | Mensagem "Postal Code is required" e permanece na etapa 1 | `checkout-validation.spec.ts` |
| CHK-05 | Conferir o resumo do pedido | Total igual ao subtotal mais o imposto | `checkout-validation.spec.ts` |
| CHK-06 | Concluir a compra | Mensagem de sucesso e carrinho vazio | `checkout-validation.spec.ts` |

### 4.5 API (`tests/api.spec.ts`, `tests/api-booking.spec.ts`)

| ID | Cenário | Resultado esperado | Arquivo |
|---|---|---|---|
| API-01 | Criar reserva (POST) | Status 200, `bookingid` e dados devolvidos | `api.spec.ts` |
| API-02 | Consultar reserva criada (GET) | Status 200 e dados iguais aos enviados | `api-booking.spec.ts` |
| API-03 | Consultar reserva inexistente | Status 404 | `api-booking.spec.ts` |
| API-04 | Atualizar reserva com token válido (PUT) | Status 200 e dados atualizados | `api-booking.spec.ts` |
| API-05 | Atualizar reserva sem token | Status 403 | `api-booking.spec.ts` |
| API-06 | Excluir reserva (DELETE) e consultar de novo | Exclusão com status 201 e depois 404 na consulta | `api-booking.spec.ts` |
| API-07 | Gerar token com credenciais válidas | Status 200 e `token` preenchido | `api-booking.spec.ts` |
| API-08 | Gerar token com credenciais inválidas | Corpo com `reason: "Bad credentials"`, sem `token` | `api-booking.spec.ts` |

## 5. Critérios de aprovação

- Todos os testes passam na execução do CI, após as tentativas automáticas (2 retries no CI).
- Nenhum teste marcado com `test.only` (o `forbidOnly` falha o CI se houver).

## 6. Riscos e limitações

- **Sistemas de terceiros:** os dois alvos são sites públicos de demonstração e podem mudar ou ficar fora do ar, o que causaria falhas que não são defeitos dos testes.
- **Restful Booker compartilhado:** é um ambiente público, usado por muitas pessoas ao mesmo tempo. Por isso cada teste cria e usa a própria reserva.
- **Comportamento da API:** o login inválido responde com status 200 e uma mensagem no corpo, em vez de 401. O teste API-08 valida o comportamento real, não o ideal.
- **Dados fixos:** os usuários de teste da SauceDemo são públicos e fixos, então não há dados sensíveis no repositório.
