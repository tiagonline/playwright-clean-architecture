import { test } from '@playwright/test';
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

    await test.step('Dado: Que acesso a loja com usuário padrão', async () => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
    });
  });

  test('Deve realizar a compra de um item com sucesso (E2E)', async ({ page }) => {
    
    await test.step('Quando: Adiciono a mochila ao carrinho', async () => {
      await inventoryPage.addBackpackToCart();
      await inventoryPage.goToCart();
    });

    await test.step('E: Prossigo para o checkout', async () => {
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
});