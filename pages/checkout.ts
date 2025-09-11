import {expect, Page, Locator, FrameLocator } from '@playwright/test';
import { Burger } from '../pages/create-your-own';

export class CheckoutPage{

        // Headings and summary
    private readonly checkoutHeading: Locator;
    private readonly pickupFromHeading: Locator;
    private readonly pickupAddress: Locator;
    private readonly orderSummaryHeading: Locator;
    private readonly orderSummaryItem: Locator;
    private readonly orderSummaryList: Locator;
    private readonly subtotalTable: Locator;
    private readonly totals: Locator;

    // Customer info fields
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly phone: Locator;
    private readonly password: Locator;

    // Payment info
    private readonly creditCardRadio: Locator;
    private readonly cardInfoHeading: Locator;
    private readonly cardFrame: FrameLocator;
    private readonly cardNumber: Locator;
    private readonly expiryDate: Locator;
    private readonly securityCode: Locator;
    private readonly postalCode: Locator;
    private readonly confirmButton: Locator;

    // Final step
    private readonly placeOrderButton: Locator;

    
    constructor(public page: Page){
       this.page = page;
        // Headings and summary
        this.checkoutHeading = page.getByRole('heading', { name: 'Checkout' }).describe('Checkout heading');
        this.pickupFromHeading = page.getByRole('heading', { name: 'Pickup From' }).describe('Pickup From heading');
        this.pickupAddress = page.locator('address').describe('Pickup address');
        this.orderSummaryHeading = page.getByRole('heading', { name: 'Order Summary' }).describe('Order Summary heading');
        this.orderSummaryItem = page.getByText('CREATE YOUR OWN').describe('Order Summary item CREATE YOUR OWN');
        this.orderSummaryList = page.getByTestId('page-checkout:order-summary').getByRole('list').describe('Order Summary list');
        this.subtotalTable = page.locator('tbody').describe('Order Summary price table');
        this.totals = page.locator('dl').describe('Order totals summary');

        // Customer info
        this.firstName = page.getByRole('textbox', { name: 'First Name' }).describe('First Name textbox');
        this.lastName = page.getByRole('textbox', { name: 'Last Name' }).describe('Last Name textbox');
        this.email = page.getByRole('textbox', { name: 'Email Address' }).describe('Email Address textbox');
        this.phone = page.getByRole('textbox', { name: 'Phone Number' }).describe('Phone Number textbox');
        this.password = page.getByRole('textbox', { name: 'Password' }).describe('Password textbox');

        // Payment
        this.creditCardRadio = page.getByRole('radio', { name: 'Credit Card' }).describe('Credit Card radio');
        this.cardInfoHeading = page.getByRole('heading', { name: 'Credit card information' }).describe('Credit Card Information heading');
        this.cardFrame = page.frameLocator('#hpc--card-frame');
        this.cardNumber = this.cardFrame.getByRole('textbox', { name: 'Card Number' }).describe('Card Number field');
        this.expiryDate = this.cardFrame.getByRole('textbox', { name: 'Expiration Date' }).describe('Expiration Date field');
        this.securityCode = this.cardFrame.getByRole('textbox', { name: 'Security Code' }).describe('Security Code field');
        this.postalCode = this.cardFrame.getByRole('textbox', { name: 'Postal Code' }).describe('Postal Code field');
        this.confirmButton = page.getByRole('button', { name: 'Confirm' }).describe('Confirm button');

        // Final
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' }).describe('Place Order button');
  }

    


    async editOrderQty(qty:string){
        await this.page.getByRole('spinbutton').click();
        await this.page.getByRole('spinbutton').fill(qty);
        await this.page.getByRole('spinbutton').press('Enter');
    }

    async clickAddToCart(){
        await this.page.getByRole('button', { name: 'Add to Cart - $' }).click();
        
    }

    async checkAddToCartSuccess(successMsg: string){
        await expect(this.page.locator('text='+successMsg+' has been added to your cart.')).toHaveCount(1)
    }

    async clickProceedToCheckout(){
        await this.page.getByRole('link', { name: 'Proceed to checkout' }).click();
    }

        async clickReturnToMenu(){
        await this.page.getByRole('link', { name: 'Return to menu' }).click();
    }

    async verifyCheckoutSummaryWithOptions(burger: Burger) {
        await expect(this.checkoutHeading).toBeVisible();
        await expect(this.pickupFromHeading).toBeVisible();
        await expect(this.pickupAddress).toBeVisible();

        await expect(this.orderSummaryHeading).toBeVisible();
        await expect(this.orderSummaryItem).toBeVisible();

        // Verify dynamic options
        await expect(this.orderSummaryList).toContainText(new RegExp(burger.size, 'i'));
        await expect(this.orderSummaryList).toContainText(new RegExp(burger.bun, 'i'));
        await expect(this.orderSummaryList).toContainText(new RegExp(burger.cheese, 'i'));

        if (burger.extraCheese) {
        for (const extra of burger.extraCheese) {
            await expect(this.orderSummaryList).toContainText(new RegExp(extra, 'i'));
        }
        }

        if (burger.toppings) {
        for (const topping of burger.toppings) {
            await expect(this.orderSummaryList).toContainText(new RegExp(topping, 'i'));
        }
        }

        if (burger.sauces) {
        for (const sauce of burger.sauces) {
            await expect(this.orderSummaryList).toContainText(new RegExp(sauce, 'i'));
        }
        }

        if (burger.addOns) {
        for (const addOns of burger.addOns) {
            await expect(this.orderSummaryList).toContainText(new RegExp(addOns, 'i'));
        }
        }

        // Optional: Subtotal and totals validation can be made dynamic if pricing logic is added
        await expect(this.subtotalTable).toBeVisible();
        await expect(this.totals).toBeVisible();
    }

    async fillCustomerInfo(customer: { first: string; last: string; email: string; phone: string }) {
        await expect(this.firstName).toBeVisible();
        await this.firstName.fill(customer.first);

        await expect(this.lastName).toBeVisible();
        await this.lastName.fill(customer.last);

        await expect(this.email).toBeVisible();
        await this.email.fill(customer.email);

        await expect(this.phone).toBeVisible();
        await this.phone.fill(customer.phone);

    }

    async fillPaymentInfo(card: { number: string; expiry: string; cvv: string; zip: string }) {
        await expect(this.creditCardRadio).toBeVisible();
        await this.creditCardRadio.click();

        await expect(this.cardInfoHeading).toBeVisible();

        await expect(this.cardNumber).toBeVisible();
        await this.cardNumber.fill(card.number);

        await expect(this.expiryDate).toBeVisible();
        await this.expiryDate.fill(card.expiry);

        await expect(this.securityCode).toBeVisible();
        await this.securityCode.fill(card.cvv);

        await expect(this.postalCode).toBeVisible();
        await this.postalCode.fill(card.zip);

        await expect(this.confirmButton).toBeVisible();
        await this.confirmButton.click();
    }

    async placeOrder() {
        await expect(this.placeOrderButton).toBeVisible();
        await this.placeOrderButton.click();
    }

    
}