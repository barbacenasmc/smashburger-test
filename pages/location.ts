import { Page } from '@playwright/test';

export class LocationsPage{

    
    constructor(public page: Page){
       this.page = page;
    }

    async gotoLocationsPage() {
        await this.page.goto('https://dev.smashburger.com/locations');
    }

    async selectOrderType(orderType: string){
        await this.page.getByRole('button', { name: 'Order Type' }).click();
        await this.page.getByLabel('Pickup').getByText(orderType).click();
    }

    async searchLocation(zipcode: string){
        await this.page.getByRole('combobox', { name: 'Search' }).click();
        await this.page.getByRole('combobox', { name: 'Search' }).fill(zipcode);
        await this.page.getByRole('option', { name: 'Search for “'+zipcode+'”' }).click();
        await this.page.locator('button').filter({ hasText: 'Search' }).click();
    }

    async chooseFirstLocation(){
        await this.page.waitForSelector('[data-testid="location-search-result-item"]');
        await this.page.locator(':nth-match(:text("Start Order"), 2)').click();
    }

}