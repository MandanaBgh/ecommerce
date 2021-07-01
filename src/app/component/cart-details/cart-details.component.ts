import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  theCartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    return this.ListItemsProducts();
  }
  ListItemsProducts() {
    this.theCartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );
    this.cartService.computeCartTotals();
  }
  incrementQuantity(thecartItem: CartItem) {

    this.cartService.addToCart(thecartItem);
  }

  decrementQuantity(thecartItem: CartItem) {
    this.cartService.removefromcart(thecartItem);
  }
  remove(thecartItem: CartItem) {
    this.cartService.remove(thecartItem);
  }
}
