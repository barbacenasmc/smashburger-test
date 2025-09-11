import {expect,Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Burger } from '../pages/create-your-own';

export class CartPage{

    private readonly page: Page;
    private readonly inputQty: Locator;
    private readonly cartHeading: Locator;
    private readonly createYourOwnItem: Locator;
    private readonly itemRow: Locator;
    private readonly checkoutLink: Locator;
    private readonly totals: Locator;
    private readonly cartImages: Locator;
    
    constructor(page: Page){
       this.page = page;
       this.inputQty = page.getByRole('spinbutton');
       this.cartHeading = page.getByRole('heading', { name: 'Cart' }).describe('Cart heading');
       this.cartImages = page.getByRole('img', { name: /cart item/i }).describe('Cart item images');
       this.checkoutLink = page.getByRole('link', { name: 'Checkout' }).describe('Checkout link');
       this.createYourOwnItem = page.getByText('CREATE YOUR OWN', { exact: true }).describe('Cart item: CREATE YOUR OWN');
       this.itemRow = page.getByRole('rowheader').describe('Cart item row with details');
       this.checkoutLink = page.getByRole('link', { name: 'Checkout' }).describe('Checkout link');
       this.totals = page.locator('dl').describe('Cart totals summary');
    }


    async editOrderQty(qty:string){
        this.inputQty.click();
        this.inputQty.fill(qty);
        this.inputQty.press('Enter');
    }

    async checkCartItem(productName:string){
       // const row = this.page.locator('tr:has-text("'+productName+'")');
       const row = this.page.getByRole('rowheader', { name:  productName });
        await expect(row).toBeVisible();
    }

    async viewCart(){
        await this.page.getByRole('link', { name: 'View Cart' }).click();
    }

    async insertMockCartImages(){
        const mockImagePath = path.join(__dirname, 'test.png'); // Create a small mock-image.png in the same directory
        await this.page.route('**/placeholder.e96474ea.jpg', async route => {
            await route.fulfill({
            status: 200,
            contentType: 'image/jpg',
            body: fs.readFileSync(mockImagePath)
            });
        });
        
    }

    async verifyCartImages() {
    const count = await this.cartImages.count();
    for (let i = 0; i < count; i++) {
      console.log("expect imange"+i+" to be visible")
      await expect(this.cartImages.nth(i)).toBeVisible();
    }

  }

    async verifyCartSummaryWithOptions(burger: Burger) {
    await expect(this.cartHeading).toBeVisible();
    await expect(this.createYourOwnItem).toBeVisible();

    // Size (patty)
    await expect(this.itemRow).toContainText(new RegExp(burger.size, 'i'));

    // Bun
    await expect(this.itemRow).toContainText(new RegExp(burger.bun, 'i'));

    // Cheese
    await expect(this.itemRow).toContainText(new RegExp(burger.cheese, 'i'));

    // Extra Cheese
    if (burger.extraCheese) {
      for (const extra of burger.extraCheese) {
        await expect(this.itemRow).toContainText(new RegExp(extra, 'i'));
      }
    }

    // Toppings
    if (burger.toppings) {
      for (const topping of burger.toppings) {
        await expect(this.itemRow).toContainText(new RegExp(topping, 'i'));
      }
    }

    // Sauces
    if (burger.sauces) {
      for (const sauce of burger.sauces) {
        await expect(this.itemRow).toContainText(new RegExp(sauce, 'i'));
      }
    }

    // Premium Add-ons
    if (burger.addOns) {
      for (const addOns of burger.addOns) {
        await expect(this.itemRow).toContainText(new RegExp(addOns, 'i'));
      }
    }

    // Optional: if totals vary by choice, we can either
    //  - skip validating totals here, or
    //  - calculate expected totals dynamically if you have pricing logic.
  }

    async proceedToCheckout() {
        await expect(this.checkoutLink).toBeVisible();
        await this.checkoutLink.click();
  }
}