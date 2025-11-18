// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

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
    // Valida a Regra de Negócio: Login deve falhar com credenciais inválidas.
    const errorText = 'Epic sadface: Username and password do not match any user in this service';
    
    await test.step('Quando: Tenta logar com senha invalida', async () => {
      await loginPage.login('standard_user', 'senha_errada');
    });

    await test.step('Então: Deve mostrar mensagem de erro (Usando POM)', async () => {
      await loginPage.validateErrorMessage(errorText); 
    });
  });

  test('Cenário E2E Principal - Deve realizar a compra de um item com sucesso', async ({ page }) => {
    
    await test.step('Dado: Que o login é feito com sucesso', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });
    
    await test.step('Quando: Adiciono a mochila e prossigo para o checkout', async () => {
      await inventoryPage.addBackpackToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('E: Preencho os dados de entrega', async () => {
      await checkoutPage.fillInformation('Tiago', 'Silva', '32000-000');
    });

    await test.step('Então: Finalizo o pedido e vejo a confirmação', async () => {
      await checkoutPage.finishCheckout();
      await checkoutPage.validateOrderComplete();
    });
  });

  test('Cenário Exceção - Deve falhar o checkout com campos de entrega incompletos', async () => {
    // Valida a Regra de Negócio: Formulário de checkout deve validar campos obrigatórios.
    
    await test.step('Dado: Que o login é feito com sucesso', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });
    
    await test.step('Quando: Adiciono item e tento continuar sem o CEP', async () => {
      await inventoryPage.addBackpackToCart();
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      // Simulando dados incompletos
      await checkoutPage.fillInformation('Tiago', 'Silva', ''); 
    });

    await test.step('Então: Deve exibir a mensagem de erro "Postal Code is required"', async () => {
      await checkoutPage.validateErrorMessage('Error: Postal Code is required');
    });
  });
});