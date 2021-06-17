import { LocationChangeEvent } from "@angular/common"

export class Product {

    sku!: string;
    name!: string;
    description!: string;
    unit_price!: number;
    image_url!: string;
    active!: boolean;
    units_in_stock!: number;
    date_created!: Date;
    last_updated!: Date;
}
