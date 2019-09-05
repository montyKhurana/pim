import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs/index';
import {Product} from "../models/product";


const PRODUCTS = "/products";
const DETAILS = "/details/";

/**
 * Class representing PIM service.
 *
 * @class AppService.
 */
@Injectable()
export class AppService {

  private getProductsUrl = PRODUCTS;
  private createProductUrl = PRODUCTS;
  private getDetails = DETAILS;
  private deleteProductUrl = PRODUCTS + '/';
  private updateProductUrl = PRODUCTS + '/';

  constructor(private http: HttpClient) {
  }


  /**
   * Makes a http get request to retrieve the lis of products from the backend service.
   */
  public getProducts() {
    return this.http.get(this.getProductsUrl).pipe(
      map(response => response)
    );
  }


  /**
   * Makes a http get request to retrieve details for aproduct from the backend service.
   */
  public getDetailsForProduct(id: Number) {
    return this.http.get(this.getDetails + id).pipe(
      map(response => response),
      catchError((e: any) => {
        return throwError(e);
      }),
    );
  }

  /**
   * Makes a http post request to add product to backend & get response.
   */
  public createProduct(product: Product): Observable<any> {
    return this.http.post(this.createProductUrl, product);
  }

  /**
   * Makes a http delete request to delete the product to backend & get response.
   */
  public deleteProduct(id: Number): Observable<any> {
    return this.http.delete(this.deleteProductUrl + id);
  }


  /**
   * Makes a http put request to update product data to backend & get response.
   */
  public updateProduct(id: Number, product: Product): Observable<any> {
    return this.http.put(this.updateProductUrl + id, product);
  }
}
