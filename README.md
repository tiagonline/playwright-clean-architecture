# ✈️ playwright-on-flight

[![Playwright Tests (CI/CD)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml)
[![API Tests (Postman/Newman)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml)

**Projeto de Automação Full Stack (Web & API) para Avaliação Técnica - Onfly**

**Candidato:** Tiago Silva

**Objetivo:** Atender a solicitação do desafio técnico: **Definir casos de testes e criar a automação E2E (Ponta a Ponta) para um fluxo de compras de e-commerce utilizando Playwright** (sem finalizar a compra).

---

## 1. Decisões de Arquitetura

Este projeto foi construído em **Playwright (TypeScript)**, escolhido por sua estabilidade em CI/CD e velocidade.

1.  **Page Object Model (POM):** Arquitetura utilizada para garantir **manutenibilidade** e **separação de responsabilidades**. O teste lê como uma história do usuário, e a manutenção dos seletores é centralizada (Design Pattern essencial que a Fernanda irá gostar).
2.  **BDD Style:** As etapas de teste foram definidas usando `test.step` para que o relatório (rodar `npx playwright show-report`) funcione como **documentação viva** (BDD Style), facilitando o entendimento para Stakeholders e QAs.
3.  **CI/CD (DevOps):** O projeto já inclui um pipeline básico (no `.github/workflows/playwright.yml`) para rodar os testes automaticamente no GitHub Actions.

## 2. Requisitos & Execução

### Pré-requisitos

- Node.js (v18+)
- Playwright Browsers (instalado via `npm init playwright`)

### Execução

1.  Clone o repositório.
2.  Instale as dependências: `npm install`
3.  Execute o teste (Headless): `npx playwright test`
4.  Visualize o Relatório HTML: `npx playwright show-report`

---

## 3. Próximos Passos

Para levar este projeto para um ambiente de produção Onfly, os próximos passos seriam:

1.  **Integração com Xray/Jira:** Integrar o relatório de testes para que os cenários sejam visíveis no painel de gestão de testes da equipe ( percebi que o Xray é usado na Onfly).
2.  **Mocks & Fixtures:** Migrar os dados de Login e Checkout para o arquivo de Fixtures do Playwright para maior segurança e reuso de dados.
3.  **API Testing:** Adicionar o módulo de testes de API (Backend) no mesmo pipeline para garantir a qualidade de ponta a ponta (mesmo com a API ServeRest fora do ar, o design do teste já estaria pronto).
4. **Contrato de Testes (Pact)**: Implementar o Contract Testing (ferramentas como Pact) nas APIs internas. Com isso melhora e garante a arquitetura de QA e que o time de Backend nunca quebre acidentalmente a integração com o Frontend ou com outro microserviço da Onfly, por exemplo, aumentando a confiança no deploy.
5. **Performance no CI**: Integrar Testes de Performance (K6) diretamente no pipeline de CI/CD. Esse ponto previne lentidão no checkout ou nas buscas de passagens (que custam dinheiro) antes que o código vá para produção.