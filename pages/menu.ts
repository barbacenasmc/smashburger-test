import { Page, Locator} from '@playwright/test';

export class MenuPage{

    private readonly chooseLocationLink : Locator;
    private readonly orderNowBtn : Locator;

    constructor(public page: Page){
       this.page = page;
    }

    async gotoMenuPage() {
        await this.page.goto('/menu');
    }

    async clickChooseLocation(){
        await this.page.getByRole('link', { name: 'Choose a location to order' }).click();
    }

    async clickOrderNow(){
        await this.page.getByRole('banner').getByRole('link', { name: 'Order Now' }).click();
    }

    async clickMenuOption(menuItem:string){
        await this.page.getByRole('link', { name: menuItem }).click();
    }

    async clickSubMenuOption(subMenuItem:string){
        await this.page.getByRole('link', { name: subMenuItem, exact: true }).click();
    }



}