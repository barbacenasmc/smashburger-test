import fs from 'fs';
import path from 'path';

export interface OrderData {
  zipcode: string;
  burgerOptions: {
    size: string;
    bun: string;
    cheese: string;
    toppings: string[];
    quantity: number;
  };
  paymentMethod: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
  cardInfo: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

export function getOrderData(): OrderData[] {
  const filePath = path.resolve(__dirname, '../test-data/order.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as OrderData[];
}
