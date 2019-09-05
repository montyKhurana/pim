import {Component, Input, OnInit} from '@angular/core';
import {Details, Product} from "../../models/product";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';
import {FormArray} from '@angular/forms';
import {AppService} from "../../services/app.service";
import {Observable, timer} from "rxjs";
import * as _ from "lodash";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  @Input() product: Product | undefined;
  @Input() isProductUpdate: boolean = false;
  productForm: any;
  isProductFormNotValid = false;
  isSubmitComplete = false;
  submitSuccessMessage: string | undefined;
  submitFailMessage: string | undefined;

  timer: Observable<any> | undefined;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit() {
    this.initProductForm(this.product);
  }

  initProductForm(product: Product | undefined) {
    if (product) {
      this.productForm = this.fb.group({
        id: [product.id],
        name: [product.name, Validators.required],
        category: [product.category],
        code: [product.code],
        price: [product.price],
        details: this.fb.array([])
      });
      this.appService.getDetailsForProduct(product.id).subscribe((responseData: any) => {
        if (responseData && responseData.length > 0) {
          for (var productDetails of responseData) {
            this.addDetailWithParams(productDetails);
          }
        }
      }, err => {
        this.isProductFormNotValid = true;
        this.submitFailMessage = "Something went wrong while fetching details"
      })
    } else {
      this.productForm = this.fb.group({
        id: [0],
        name: ['', Validators.required],
        category: [''],
        code: [''],
        price: [0],
        details: this.fb.array([])
      });
      this.addDetail();
    }
  }

  get details() {
    return this.productForm.get('details') as FormArray;
  }

  addDetail() {
    let fg = this.fb.group(new Details());
    this.details.push(fg);
  }

  removeDetail(index: number) {
    this.details.removeAt(index);
  }

  addDetailWithParams(productDetails: any) {
    let fg = this.fb.group(productDetails);
    this.details.push(fg);
  }

  get name() {
    return this.productForm.get('name');
  }

  saveProduct(isProductUpdate: boolean) {
    let inputProduct: Product = this.productForm.value;
    this.handleEmptyKeyValuePairInDetails(inputProduct);
    // error handling to display error message if something goes wrong

    if (isProductUpdate) {
      // update/edit product case
      this.appService.updateProduct(inputProduct.id, inputProduct).subscribe((response: any) => {
        this.isSubmitComplete = true;
        this.submitSuccessMessage = "The product is successfully updated"; // we shud set backend response here
        this.setTimer();
      }, error => {
        this.isProductFormNotValid = true;
        this.submitFailMessage = "Something went wrong while updating product"
      });
    } else {
      // create product case
      this.appService.createProduct(inputProduct).subscribe((response: any) => {
        this.isSubmitComplete = true;
        this.submitSuccessMessage = "The product is successfully created"; // we shud set backend response here
        this.initProductForm(undefined);
        this.setTimer();
      }, error => {
        this.isProductFormNotValid = true;
        this.submitFailMessage = "Something went wrong while adding product"
      });
    }
  }

  handleEmptyKeyValuePairInDetails(inputProduct: Product) {
    // @ts-ignore
    _.remove(inputProduct.details, function (detail) {
      return detail.key.length <= 0 && detail.value.length <= 0
    });
    this.details.clear();
    // @ts-ignore
    for (var productDetails of inputProduct.details) {
      this.addDetailWithParams(productDetails);
    }
  }

  public setTimer() {
    this.isSubmitComplete = true;
    this.timer = timer(2000);
    this.timer.subscribe(() => {
      this.isSubmitComplete = false;
    });
  }
}
