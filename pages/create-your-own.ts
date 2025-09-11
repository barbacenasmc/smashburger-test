import {expect,Page, Locator} from '@playwright/test';

export interface Burger {
  size: string;
  bun: string;
  cheese: string;
  toppings?: string[];
  extraCheese?: string[];
  sauces?: string[];
  addOns?: string[];
  quantity?: number;
}

export class CreateYourOwnPage{
    
    private readonly startOrder: Locator;
    private readonly createYourOwnHeading: Locator;
    private readonly burgerSizeList: Locator;
    private readonly chooseBunText: Locator;
    private readonly pickCheeseText: Locator;
    private readonly pickExtraCheeseText: Locator;
    private readonly chooseToppingsText: Locator;
    private readonly chooseSauceText: Locator;
    private readonly chooseAddOnsText: Locator;
    private readonly addToCartButton: Locator;
    private readonly proceedToCheckoutLink: Locator;
    private readonly confirmationMessage: Locator;

    constructor(public page: Page){
        this.page = page;
        this.startOrder = page.getByRole('link', { name: 'Start an Order' }).describe('Start Order link')
        this.createYourOwnHeading = page.getByRole('heading', { name: 'CREATE YOUR OWN' }).describe('Create Your Own heading');
        this.burgerSizeList = page.getByRole('button', { name: 'Pick a Size Double Beef' }).describe('Burger size options dropdown')
        this.chooseBunText = page.getByText('Choose an Artisan Bun').describe('Choose bun instruction text');
        this.pickCheeseText = page.getByText('Pick 1 Cheese').describe('Pick cheese instruction text');
        this.pickExtraCheeseText = page.getByText('Extra Cheese').describe('Pick extra cheese instruction text');
        this.chooseToppingsText = page.getByText('Choose Your Toppings').describe('Choose toppings instruction text');
        this.chooseSauceText = page.getByText('Choose Your Sauce').describe('Choose sauce instruction text');
        this.chooseAddOnsText = page.getByText('Premium Add-Ons').describe('Choose add-ons instruction text');
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart - $' }).describe('Add to Cart button');
        this.confirmationMessage = page.getByLabel('CREATE YOUR OWN has been').getByText('CREATE YOUR OWN').describe('Add to cart confirmation message');
        this.proceedToCheckoutLink = page.getByRole('link', { name: 'Proceed to checkout' }).describe('Proceed to checkout link');
    }

    private getSizeOption(size: string): Locator {
    return this.page.getByRole('option', { name: size }).describe(`${size} size option`);
  }

    private getBunOption(bun: string): Locator {
        return this.page.getByRole('radio', { name: bun }).describe(`${bun} size option`);
    }

    private getCheeseOption(cheese: string): Locator {
        return this.page.getByRole('radio', { name: cheese }).describe(`${cheese} size option`);
    }
    
    private getToppingOption(topping: string): Locator {
        return this.page.getByRole('checkbox', { name: topping }).describe(`${topping} size option`);
    }

    private getExtraCheeseOption(extra: string): Locator {
        return this.page.getByRole('checkbox', { name: extra }).describe(`${extra} size option`);
    }

    private getSauceOption(sauce: string): Locator {
        return this.page.getByRole('checkbox', { name: sauce }).describe(`${sauce} size option`);
    }

    private getPremiumOption(premium: string): Locator {
        return this.page.getByRole('checkbox', { name: premium }).describe(`${premium} size option`);
    }



    async gotoCreateYourOwn() {
        await this.page.goto('/menu/smashburgers/create-your-own');
    }
    async clickStartOrder(){
        await expect(this.startOrder).toBeVisible();
        await this.startOrder.click();
    }
    async createBurger(burger: Burger){
        //await this.page.getByRole('radio', { name: size }).check();
        await expect(this.createYourOwnHeading).toBeVisible();


        //Select size
        await expect(this.burgerSizeList).toBeVisible()
        //Expand burger size dropdown list
        await this.burgerSizeList.click()
        const sizeOption = this.getSizeOption(burger.size);
        await expect(sizeOption).toBeVisible();
        await sizeOption.click();

        //Select bun
        await expect(this.chooseBunText).toBeVisible();
        const bunOption = this.getBunOption(burger.bun);
        await expect(bunOption).toBeVisible();
        await bunOption.check();        
        
        //Select cheese
        await expect(this.pickCheeseText).toBeVisible();
        const cheeseOption = this.getCheeseOption(burger.cheese);
        await expect(cheeseOption).toBeVisible();
        await cheeseOption.check();


        //Select extra cheese
        if (burger.extraCheese) {
        for (const extra of burger.extraCheese) {
            await expect(this.pickExtraCheeseText).toBeVisible();
            const extraOption = this.getExtraCheeseOption(extra);
            await expect(extraOption).toBeVisible();
            await extraOption.check();
        }
        }

        // Toppings
        if (burger.toppings) {
        for (const topping of burger.toppings) {
            await expect(this.chooseToppingsText).toBeVisible();
            const toppingOption = this.getToppingOption(topping);
            await expect(toppingOption).toBeVisible();
            await toppingOption.check();
        }
        }

        // Sauces
        if (burger.sauces) {
        for (const sauce of burger.sauces) {
            await expect(this.chooseSauceText).toBeVisible();
            const sauceOption = this.getSauceOption(sauce);
            await expect(sauceOption).toBeVisible();
            await sauceOption.check();
        }
        }

        // Premium add-ons
        if (burger.addOns) {
        for (const addOns of burger.addOns) {
            await expect(this.chooseAddOnsText).toBeVisible();
            const premiumOption = this.getPremiumOption(addOns);
            await expect(premiumOption).toBeVisible();
            await premiumOption.check();
        }
        }

        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();

        // await this.page.getByRole('radio', { name: bun }).check();
        // await this.page.getByRole('radio', { name: cheese }).check();
        // await this.page.getByRole('checkbox', { name: extraCheese }).check();
        // await this.page.getByRole('checkbox', { name: toppings }).check();
        // await this.page.getByRole('checkbox', { name: sauce }).check();
        // await this.page.getByRole('checkbox', { name: addOns }).check();
    }

    async setOrderQty(qty){
        await this.page.getByRole('spinbutton', { name: 'Quantity' }).click();
        await this.page.getByRole('spinbutton', { name: 'Quantity' }).fill(qty);
        await this.page.getByRole('spinbutton', { name: 'Quantity' }).press('Enter');
    }

    async checkAddToCartSuccess(successMsg: string){
        await expect(this.page.locator('text='+successMsg+' has been added to your cart.')).toHaveCount(1)
    }

    async clickProceedToCheckout(){
        await expect(this.confirmationMessage).toBeVisible();
        await expect(this.proceedToCheckoutLink).toBeVisible();
        await this.proceedToCheckoutLink.click();
    }


}