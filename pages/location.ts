import { Page, Locator} from '@playwright/test';

export class LocationsPage{

    private readonly page: Page;
    private readonly searchLocBox: Locator;
    private readonly searchLocBtn: Locator;
    
    constructor(page: Page){
       this.page = page;
       this.searchLocBox = this.page.getByRole('combobox', { name: 'Search' }).describe("Search box for location")
       this.searchLocBtn = this.page.locator('button').filter({ hasText: 'Search' }).describe("Button for searching location")
    }

    async gotoLocationsPage() {
        await this.page.goto('https://dev.smashburger.com/locations');
    }

    async selectOrderType(orderType: string){
        await this.page.getByRole('button', { name: 'Order Type' }).click();
        await this.page.getByLabel('Pickup').getByText(orderType).click();
    }

    async searchLocation(zipcode: string){
        this.searchLocBox.click();
        this.searchLocBox.fill(zipcode);
        await this.page.getByRole('option', { name: 'Search for “'+zipcode+'”' }).click();
        this.searchLocBtn.click();
    }

    async chooseFirstLocation(){
        await this.page.waitForSelector('[data-testid="location-search-result-item"]');
        await this.page.locator(':nth-match(:text("Start Order"), 2)').click();
    }

}