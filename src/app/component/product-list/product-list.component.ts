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
  thePageSize: number = 5;
  thePageNumber: number = 1;
  theTotalElements: number = 1;
  thePreviuosCategory: number = 1;
  previousWord: string = "";
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
    if (this.previousWord != thekeyword) {
      this.thePageNumber = 1;
    }
    this.previousWord = thekeyword;
    this.theProductService.searchProductPaginate(this.thePageNumber - 1,
      this.thePageSize, thekeyword).subscribe(this.proccessList());

  }



  handleProductList() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currentCategoryId = 1;
    }


    if (this.thePreviuosCategory != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.theProductService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize, this.currentCategoryId).subscribe(this.proccessList());

  }

  proccessList() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products,
        this.thePageNumber = data.page.number + 1,
        this.thePageSize = data.page.size,
        this.theTotalElements = data.page.totalElements
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.ProductList();
  }

}
