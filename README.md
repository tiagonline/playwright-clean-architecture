# ✈️ playwright-on-flight

[![Playwright Tests (CI/CD)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml)
[![API Tests (Postman/Newman)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml)

**Projeto de Automação Full Stack (Web & API) para Avaliação Técnica - Onfly**

**Candidato:** Tiago Silva

---

## Sobre o Projeto

Este teste técnico foi estruturado um plano de automação E2E em **Playwright + TypeScript**.

- Usei o **Page Object Model (POM)** para garantir alta manutenibilidade e a metodologia **BDD** para tornar os testes legíveis por QAs e PMs.  
- O projeto já inclui pipelines de **CI/CD** (Web e API), provando que a solução é escalável e está pronta para ser integrada ao processo de entrega contínua da Onfly.

---

## Decisões de Arquitetura

1. **Page Object Model (POM):** Separação total entre a lógica do teste e os seletores da página, facilitando a manutenção.  
2. **BDD Style:** Uso de `test.step` para criar relatórios que funcionam como **documentação viva** dos cenários.  
3. **Full Stack QA:**
   - **Web (Playwright):** Testes E2E de fluxo crítico (Checkout) com cenários positivos, negativos e de exceção.  
   - **API (Postman/Newman):** Testes de integração de CRUD com validação de contrato e dados dinâmicos.  
4. **CI/CD (GitHub Actions):** Pipelines automatizados para Web e API com geração de artefatos (Reports) e segurança de tokens (Secrets).
5. **Monitoramento Sintético (Cron Job):** Rodar testes de API agendados (09:00 AM). Criar alertas antecipados de falha antes do cliente perceber.

---

## Como Executar

### Pré-requisitos

- Node.js (v18+)
- Playwright Browsers (instalado via `npm init playwright`)

---

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/tiagonline/playwright-on-flight.git
cd playwright-on-flight
npm install
npx playwright install --with-deps
```

---

### 2. Rodar Testes Web (Playwright)

Para validar o fluxo E2E de Checkout:

#### Executar testes (Headless)

```bash
npx playwright test
```

#### Visualizar relatório (Trace Viewer)

```bash
npx playwright show-report
```

---

### 3. Rodar Testes de API (Newman)
Para validar o CRUD de Usuários (GoRest):

> **Nota:** O token de autenticação não é versionado por segurança. Você deve fornecer seu próprio Token Bearer (GoRest) via linha de comando. Por segurança, nas execuções do Github Actions o token foi embedado como secret.

```bash
npm run test:api -- --env-var "token=SEU_TOKEN_AQUI"
```
**Nota sobre CI/CD da API:** Os testes de API automatizados via Cron Job podem apresentar instabilidade (falso-negativo) devido ao bloqueio de segurança (WAF/Cloudflare) da API pública GoRest contra os IPs dos runners do GitHub Actions, ainda mais que coloquei o monitoramento sintético todo dia as 9h. Em um ambiente real corporativo, isso seria resolvido com Whitelist de IPs.

---
## Próximos Passos (Visão de Futuro)

Para evoluir este projeto em um ambiente de produção na Onfly, minha estratégia seria:

1. **Integração com Xray/Jira:** Conectar o relatório de testes para visibilidade total do time de gestão.  
2. **Contract Testing (Pact):** Implementar testes de contrato nas APIs críticas para garantir que mudanças no Backend não quebrem o Frontend ou Mobile.  
3. **Performance no Pipeline:** Integrar testes de carga com K6 diretamente no CI para validar a performance de endpoints críticos (ex: busca de passagens).  
4. **IA & Self-Healing:** Explorar recursos de IA para "auto-correção" de seletores (self-healing), visando reduzir o custo de manutenção dos scripts a longo prazo.
5. **Regressão Visual (Percy.io):** Comparação de pixels (snapshots) garante que o CSS não quebrou e que a marca/UX está intacta.
6. **Cross-browser em Nuvem (BrowserStack):** Rodar os testes do Playwright em grids na nuvem (Safari, Edge, Mobile Real Devices). Como a Onfly é acessada de diversos dispositivos, eu conectaria o pipeline ao BrowserStack para garantir a compatibilidade com Safari (iOS) e dispositivos móveis, sem precisar gerenciar infraestrutura interna.
