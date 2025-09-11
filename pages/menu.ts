import { Page, Locator} from '@playwright/test';

export class MenuPage{

    private readonly page: Page;

    private readonly chooseLocationLink : Locator;
    private readonly orderNowBtn : Locator;

    constructor(page: Page){
       this.page = page;
       this.chooseLocationLink = this.page.getByRole('link', { name: 'Choose a location to order' }).describe("Choose location link")
       this.orderNowBtn = this.page.getByRole('banner').getByRole('link', { name: 'Order Now' })
    }

    async gotoMenuPage() {
        await this.page.goto('/menu');
    }

    async clickChooseLocation(){
        this.chooseLocationLink.click();
    }

    async clickOrderNow(){
        this.orderNowBtn.click();
    }

    async clickMenuOption(menuItem:string){
        await this.page.getByRole('link', { name: menuItem }).click();
    }

    async clickSubMenuOption(subMenuItem:string){
        await this.page.getByRole('link', { name: subMenuItem, exact: true }).click();
    }



}