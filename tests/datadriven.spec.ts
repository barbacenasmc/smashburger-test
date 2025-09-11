import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/menu';
import { LocationsPage } from '../pages/location';
import { CheckoutPage } from '../pages/checkout';
import { CartPage } from '../pages/cart';
import { getOrderData, OrderData } from '../utils/testdata';
import { CreateYourOwnPage } from '../pages/create-your-own';
import { ConfirmationPage } from '../pages/confirmation';

/**
 * @description
 * Data-driven tests for Smashburger "Create Your Own" pickup orders.
 *
 * @precondition
 *   - User is on Smashburger "Create Your Own" page.
 *   - User has selected a location for pickup
 * @expected
 *   - Pickup order is placed successfully for each dataset.
 *   - Cart, checkout, and order confirmation pages display correct burger details.
 */


const datasets: OrderData[] = getOrderData();
test.describe.parallel('Data Driven Testing Scenarios',() => {

    datasets.forEach((data, index) => {
        test(`Order a ${index + 1} — ${data.burgerOptions.size}, ${data.burgerOptions.bun}, ${data.burgerOptions.cheese}`, async ({ page }) => {
            const menu = new MenuPage(page);
            const location = new LocationsPage(page);
            const create = new CreateYourOwnPage(page);
            const checkout = new CheckoutPage(page);
            const cart = new CartPage(page);
            const confirmation = new ConfirmationPage(page);
            
            await create.gotoCreateYourOwn();
            await create.clickStartOrder();
            await location.selectOrderType("Pickup");
            await location.searchLocation(data.zipcode);
            await location.chooseFirstLocation();

            await menu.clickMenuOption("SMASHBURGERS");
            await menu.clickSubMenuOption("CREATE YOUR OWN");

            await create.createBurger(data.burgerOptions)
            await create.clickProceedToCheckout();
            await cart.verifyCartSummaryWithOptions(data.burgerOptions)
            await cart.proceedToCheckout()
           
            await checkout.verifyCheckoutSummaryWithOptions(data.burgerOptions)
            await cart.proceedToCheckout()
            await checkout.fillCustomerInfo({
            first: data.customerInfo.firstName,
            last: data.customerInfo.lastName,
            email: data.customerInfo.email,
            phone: data.customerInfo.phone
            });
            await checkout.fillPaymentInfo({
                number: data.cardInfo.number,
                expiry: data.cardInfo.expiry,
                cvv: data.cardInfo.cvv,
                zip: data.zipcode,
            });

            await checkout.placeOrder();
            await confirmation.verifyOrderConfirmationWithOptions(data.burgerOptions);

        });

    });


});
