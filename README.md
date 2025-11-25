# ✈️ playwright-on-flight

[![Playwright Tests (CI/CD)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/e2e-tests.yml)
[![API Tests (Postman/Newman)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-on-flight/actions/workflows/api-tests.yml)

**Projeto de Automação Full Stack (Web & API) para Avaliação Técnica - Nível Sênior**

---

## Sobre o Projeto (Qualidade de Engenharia)

Este teste técnico foi estruturado com foco em **Qualidade de Engenharia, Segurança e Escalabilidade**, pilares de um QA Sênior/Lead.

- Uso do **Page Object Model (POM)** com métodos e localizadores **genéricos** para alta escalabilidade.  
- Implementação de **Governança de Código** (`lint`, `format`) para garantir padrões de qualidade em equipe.
- Segurança reforçada através do uso de **variáveis de ambiente** e secrets para todas as credenciais sensíveis.
- O projeto já inclui pipelines de **CI/CD** (Web e API), provando que a solução é robusta e pronta para ser integrada ao processo de entrega contínua.

---

## Decisões de Arquitetura

1. **Segurança & Ambiente:** Credenciais injetadas via `process.env` (lidas de um `.env` localmente ou Secrets no CI), garantindo que dados sensíveis nunca sejam versionados (padrão Sênior).
2. **Page Object Model (POM) Escalável:** Separação total da lógica. Métodos de Page Object (e.g., `addItemToCart(itemName)`) são genéricos, garantindo que o código não precise ser alterado quando novos produtos forem adicionados.
3. **Maturidade Técnica:** Uso de scripts `lint` e `format` no `package.json` para manter o código limpo e padronizado.
4. **Full Stack QA:**
   - **Web (Playwright):** Testes E2E de fluxo crítico (Checkout) com cenários positivos, negativos e de exceção.  
   - **API (Postman/Newman):** Testes de integração de CRUD com validação de contrato e dados dinâmicos.  
5. **CI/CD (GitHub Actions):** Pipelines automatizados para Web e API com geração de artefatos (Reports) e segurança de tokens (Secrets).
6. **Monitoramento Sintético (Cron Job):** Rodar testes de API agendados para criar alertas antecipados de falha antes do cliente perceber.

---

## Como Executar

### Pré-requisitos

- Node.js (v18+)
- Playwright Browsers (instalado via `npm init playwright`)
- Crie um arquivo `.env` na raiz do projeto contendo:
   - SAUCE_USERNAME=standard_user SAUCE_PASSWORD=secret_sauce

---

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/tiagonline/playwright-on-flight.git](https://github.com/tiagonline/playwright-on-flight.git)
cd playwright-on-flight
npm install
```

### 2. Governança de Código
Execute os comandos abaixo para garantir que seu código está formatado e limpo antes do commit:
```bash
npm run format # Formata o código (Prettier)
npm run lint   # Verifica a qualidade do código (ESLint)
```

### 3. Rodar Testes Web (Playwright)
- O script npm run test agora carregará automaticamente as variáveis do .env:

Executar testes (Headless)
```bash
npm run test
```
Visualizar relatório (Trace Viewer)
```bash
npx playwright show-report
```

### 4. Rodar Testes de API (Newman)
Para validar o CRUD de Usuários (GoRest):

Nota: O token de autenticação não deve ser versionado. Por segurança, nas execuções do Github Actions o token foi embedado como secret.

```bash
npm run test:api -- --env-var "token=SEU_TOKEN_AQUI"
```

**Nota sobre CI/CD da API**: Os testes de API automatizados via Cron Job podem apresentar instabilidade (falso-negativo) devido ao bloqueio de segurança (WAF/Cloudflare) da API pública GoRest contra os IPs dos runners do GitHub Actions, ainda mais que coloquei o monitoramento sintético todo dia as 9h. Em um ambiente real corporativo, isso seria resolvido com Whitelist de IPs.

---
### **Próximos Passos (Visão de Futuro)**
Para evoluir este projeto em um ambiente de produção:

- **Integração com Xray/Jira**: Conectar o relatório de testes para visibilidade total do time de gestão.

- **Contract Testing (Pact)**: Implementar testes de contrato nas APIs críticas para garantir que mudanças no Backend não quebrem o Frontend ou Mobile.

- **Performance no Pipeline**: Integrar testes de carga com K6 diretamente no CI para validar a performance de endpoints críticos (ex: busca de passagens).

- **IA & Self-Healing**: Explorar recursos de IA para "auto-correção" de seletores (self-healing), visando reduzir o custo de manutenção dos scripts a longo prazo.

- **Regressão Visual (Percy.io)**: Comparação de pixels (snapshots) garante que o CSS não quebrou e que a marca/UX está intacta.

- **Cross-browser em Nuvem (BrowserStack/SauceLabs)**: Rodar os testes do Playwright em grids na nuvem (Safari, Edge, Mobile Real Devices). Como a Onfly é acessada de diversos dispositivos, eu conectaria o pipeline ao BrowserStack para garantir a compatibilidade com Safari (iOS) e dispositivos móveis, sem precisar gerenciar infraestrutura interna.