import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as data from '../data/fixtures.json';

test.describe('Fluxo de Checkout | Swag Labs', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test('Cenário Negativo - Deve falhar ao tentar logar com senha invalida', async () => {
    await test.step('Quando: Tenta logar com senha invalida', async () => {
      // Uso de dados do arquivo JSON
      await loginPage.login(data.users.invalid.username, data.users.invalid.password);
    });

    await test.step('Então: Deve mostrar mensagem de erro', async () => {
      await loginPage.validateErrorMessage(data.messages.loginError); 
    });
  });

  test('Cenário E2E Principal - Deve realizar a compra de um item com sucesso', async () => {
    await test.step('Dado: Que o login é feito com sucesso', async () => {
      await loginPage.login(data.users.valid.username, data.users.valid.password);
    });
    
    await test.step('Quando: Adiciono a mochila e prossigo para o checkout', async () => {
      await inventoryPage.addBackpackToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('E: Preencho os dados de entrega', async () => {
      // Dados vindos da fixture
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
      await loginPage.login(data.users.valid.username, data.users.valid.password);
    });
    
    await test.step('Quando: Adiciono item e tento continuar sem o CEP', async () => {
      await inventoryPage.addBackpackToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      
      // Simulando o erro (CEP vazio) mas mantendo Nome/Sobrenome da massa
      await checkoutPage.fillInformation(data.checkout.firstName, data.checkout.lastName, ''); 
    });

    await test.step('Então: Deve exibir a mensagem de erro de CEP obrigatório', async () => {
      await checkoutPage.validateErrorMessage(data.messages.postalCodeError);
    });
  });
});