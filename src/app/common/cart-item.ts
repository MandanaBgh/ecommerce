import { Product } from "./product";

export class CartItem {
    id !: number;
    name !: string;
    imageUrl!: string;
    unitPrice!: number;
    quantity!: number;

    constructor(theProduct: Product) {
        this.id = theProduct.id;
        this.imageUrl = theProduct.imageUrl;
        this.name = theProduct.name;
        this.unitPrice = theProduct.unitPrice;
        this.quantity = 1;

    }

}
