import { test, expect, Page } from '@playwright/test';

import { MenuPage } from '../pages/menu';
import { LocationsPage } from '../pages/location';
import { CheckoutPage } from '../pages/checkout';
import { CartPage } from '../pages/cart';

/**
 * @precondition
 * - User navigates to menu page
 * - User adds multiple menu items to cart
 * @expected
 * - All cart items with placeholder images display mock image
 */

const orderItems = [
  { menuOption: "SMASHBURGERS", subMenuOption: "DOUBLE SMOKED BRISKET BACON SMASH®", qty: "1" },
  { menuOption: "ALL-ANGUS BIG DOGS", subMenuOption: "CHILI CHEESE DOG", qty: "2" },
  { menuOption: "SIDES", subMenuOption: "LARGE FRENCH FRIES", qty: "3" }
];


    test('validate cart items mock image', async ({page}) => {
        const menu = new MenuPage(page)
        const location = new LocationsPage(page)
        const checkout = new CheckoutPage(page)
        const cart = new CartPage(page)

        await menu.gotoMenuPage()
        
        await menu.clickOrderNow()
        await location.selectOrderType("Pickup")
        await location.searchLocation("80246")  
        await location.chooseFirstLocation()

        for (const orderItem of orderItems) {
            console.log(`Order a ${orderItem.subMenuOption}`) 
                        
                await menu.clickMenuOption(orderItem.menuOption)
                await menu.clickSubMenuOption(orderItem.subMenuOption)
                await checkout.editOrderQty(orderItem.qty)
                await checkout.clickAddToCart()
                await checkout.clickReturnToMenu()         
        }
        await page.pause()
        await cart.viewCart()
        await cart.insertMockCartImages()
        await cart.verifyCartImages()
       
    });


