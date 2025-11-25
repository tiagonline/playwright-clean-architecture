import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as data from '../data/fixtures.json';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

test.describe('E2E | Fluxo de Compra SAUCE LABS', () => { 
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Credenciais via variáveis de ambiente para segurança
  const VALID_USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
  const VALID_PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    // URL Relativa
    await loginPage.goto();
  });

  test('Cenário Negativo - Deve falhar ao tentar logar com credenciais inválidas', async () => {
    // Geração dinâmica de dados inválidos
    const invalidPassword = faker.internet.password(); 
    const invalidUsername = faker.internet.userName(); // NOVO USERNAME DINÂMICO GERADO
    
    await test.step('Quando: Tenta logar com credenciais inválidas (geradas dinamicamente)', async () => {
      // Uso de username e senha 100% dinâmicos
      await loginPage.login(invalidUsername, invalidPassword); 
    });

    await test.step('Então: Deve mostrar mensagem de erro', async () => {
      await loginPage.validateErrorMessage(data.messages.loginError); 
    });
  });

  test('Cenário E2E Principal - Deve realizar a compra de um item com sucesso', async () => {
    await test.step('Dado: Que o login é feito com sucesso', async () => {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });
    
    await test.step('Quando: Adiciono a mochila e prossigo para o checkout', async () => {
      // Uso do método Page Object genérico (addItemToCart)
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('E: Preencho os dados de entrega', async () => {
      await checkoutPage.fillInformation(
        data.checkout.firstName, 
        data.checkout.lastName, 
        data.checkout.postalCode
      );
    });

    await test.step('Então: Finalizo o pedido e vejo a confirmação', async () => {
      await checkoutPage.finishCheckout();
      await checkoutPage.validateOrderComplete();
    });
  });

  test('Cenário Exceção - Deve falhar o checkout com campos de entrega incompletos', async () => {
    await test.step('Dado: Que o login é feito com sucesso', async () => {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });
    
    await test.step('Quando: Adiciono item e tento continuar sem o CEP', async () => {
      // Uso do método Page Object genérico (addItemToCart)
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      
      // Simulação de erro (CEP vazio)
      await checkoutPage.fillInformation(data.checkout.firstName, data.checkout.lastName, ''); 
    });

    await test.step('Então: Deve exibir a mensagem de erro de CEP obrigatório', async () => {
      await checkoutPage.validateErrorMessage(data.messages.postalCodeError);
    });
  });
});