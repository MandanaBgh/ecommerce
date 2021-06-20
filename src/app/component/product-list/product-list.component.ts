import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  currentCategoryId!: number;
  searchword!: boolean;

  constructor(private theProductService: ProductService,
    private route: ActivatedRoute) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.ProductList();
    });
  }


  ProductList() {

    this.searchword = this.route.snapshot.paramMap.has('keyword');
    if (this.searchword) {
      this.handleSearchWord();

    } else {
      this.handleProductList();
    }

  }

  handleSearchWord() {

    const thekeyword: string = String(this.route.snapshot.paramMap.get('keyword'));

    this.theProductService.searchProductList(thekeyword).subscribe(
      data => {
        this.products = data;
      }
    );

  }



  handleProductList() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currentCategoryId = 1;
    }

    this.theProductService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );

  }
}
