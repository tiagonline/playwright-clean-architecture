import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as data from '../data/fixtures.json';
// Importa o dotenv para carregar .env localmente se não estiver no CI
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Fluxo de Checkout | Swag Labs', () => {
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
    await loginPage.goto();
  });

  test('Cenário Negativo - Deve falhar ao tentar logar com senha invalida', async () => {
    await test.step('Quando: Tenta logar com senha invalida', async () => {
      // Uso de credenciais inválidas da fixture
      await loginPage.login(data.users.invalid.username, data.users.invalid.password);
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
      // Uso do método genérico (addItemToCart)
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
      // Uso do método genérico (addItemToCart)
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