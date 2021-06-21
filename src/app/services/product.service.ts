import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseURL = "http://localhost:8080/api/products";
  private category = "http://localhost:8080/api/product-category";


  constructor(private httpClient: HttpClient) { }


  getProductList(categoryId: number): Observable<Product[]> {
    const seachUrl = `${this.baseURL}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(seachUrl);
  }
  getProductsCategory(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.category).pipe(
      map(response => response._embedded.productCategory)
    );
  }
  searchProductList(thekeyword: string): Observable<Product[]> {
    const seachUrl = `${this.baseURL}/search/findByNameContaining?name=${thekeyword}`;
    return this.getProducts(seachUrl);
  }

  getProduct(theProductId: string): Observable<Product> {
    const seachUrl = `${this.baseURL}/${theProductId}`;
    return this.httpClient.get<Product>(seachUrl);
  }


  private getProducts(seachUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(seachUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}
interface GetResponseProduct {

  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {

  _embedded: {
    productCategory: ProductCategory[];
  }



}