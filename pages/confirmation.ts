import { expect, Page, Locator } from '@playwright/test';
import { Burger } from '../pages/create-your-own';

export class ConfirmationPage {
  private readonly page: Page;

  // Headings & basic messages
  private readonly thankYouHeading: Locator;
  private readonly thankYouH1: Locator;
  private readonly orderNumberHeading: Locator;
  private readonly orderPlacedText: Locator;
  private readonly pickupDateText: Locator;

  // Pickup section
  private readonly pickupFromButton: Locator;
  private readonly pickupAddress: Locator;

  // Order summary section
  private readonly orderSummaryButton: Locator;
  private readonly totals: Locator;
  private readonly bagFeeText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Headings & messages
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank You' }).describe('Thank You heading');
    this.thankYouH1 = page.locator('h1').describe('H1 Thank You');
    this.orderNumberHeading = page.getByRole('heading', { name: 'Order #' }).describe('Order number heading');
    this.orderPlacedText = page.getByText(/Order placed/).describe('Order placed date text');
    this.pickupDateText = page.getByText(/For pickup on/).describe('Pickup date text');

    // Pickup info
    this.pickupFromButton = page.getByRole('button', { name: 'Pickup From:1002 Glendale, CO' }).describe('Pickup From button');
    this.pickupAddress = page.locator('address').describe('Pickup address');

    // Order summary
    this.orderSummaryButton = page.getByRole('button', { name: 'Order Summary' }).describe('Order Summary button');
    this.totals = page.locator('dl').describe('Totals section');
    this.bagFeeText = page.getByText('Bag Fee$').describe('Bag Fee label');
  }

  async verifyOrderConfirmationWithOptions(burger: Burger) {
    // URL must not contain checkout
    await expect(this.page).not.toHaveURL(/.*checkout/);

    // Headings
    await expect(this.thankYouHeading).toBeVisible();
    await expect(this.thankYouH1).toContainText('Thank You');
    await expect(this.orderNumberHeading).toBeVisible();

    // Dates
    await expect(this.orderPlacedText).toBeVisible();
    await expect(this.pickupDateText).toBeVisible();

    // Expand Pickup info
    await expect(this.pickupFromButton).toBeVisible();
    await this.pickupFromButton.click();
    await expect(this.pickupAddress).toBeVisible();

    // Expand Order Summary
    await expect(this.orderSummaryButton).toBeVisible();
    await this.orderSummaryButton.click();

    // Verify dynamic options
    await expect(this.totals).toContainText(new RegExp(burger.size, 'i'));
    await expect(this.totals).toContainText(new RegExp(burger.bun, 'i'));
    await expect(this.totals).toContainText(new RegExp(burger.cheese, 'i'));

    if (burger.extraCheese) {
      for (const extra of burger.extraCheese) {
        await expect(this.totals).toContainText(new RegExp(extra, 'i'));
      }
    }

    if (burger.toppings) {
      for (const topping of burger.toppings) {
        await expect(this.totals).toContainText(new RegExp(topping, 'i'));
      }
    }

    if (burger.sauces) {
      for (const sauce of burger.sauces) {
        await expect(this.totals).toContainText(new RegExp(sauce, 'i'));
      }
    }

    if (burger.addOns) {
      for (const addOns of burger.addOns) {
        await expect(this.totals).toContainText(new RegExp(addOns, 'i'));
      }
    }

    // Totals visible
    await expect(this.bagFeeText).toBeVisible();
    await expect(this.totals).toBeVisible();
  }
}
