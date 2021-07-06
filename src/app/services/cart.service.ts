import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {



  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  constructor() { }


  addToCart(theCartItem: CartItem) {
    let alreadyExsistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExsistInCart = (existingCartItem != undefined);
    }
    if (alreadyExsistInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log(`Show Cart Items`);
    for (let theItems of this.cartItems) {
      const sumOfItems = theItems.unitPrice * theItems.quantity;
      console.log(`${theItems.quantity} ---- ${theItems.quantity} --- ${sumOfItems}`);
    }
    console.log(`${totalPriceValue} ===== ${totalQuantityValue}`);
  }


  removefromcart(thecartItem: CartItem) {
    thecartItem.quantity--;
    if (thecartItem.quantity === 0) {
      this.remove(thecartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(thecartItem: CartItem) {
    const ItemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === thecartItem.id);
    if (ItemIndex > -1) {
      this.cartItems.splice(ItemIndex, 1);
      this.computeCartTotals();
    }
  }
}
