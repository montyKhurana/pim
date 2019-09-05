import {Component, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditModalComponent} from "../../edit-modal/edit-modal.component";
import {Product} from "../../models/product";
import * as _ from "lodash";
import {Observable, timer} from "rxjs";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  productDeletionFail: boolean = false;
  deletionComplete: boolean = false;
  deleteSuccessMessage: string | undefined;
  deleteFailMessage: string | undefined;
  title = "PRODUCT LIST";

  timer: Observable<any> | undefined;

  constructor(private appService: AppService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.appService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  editProduct(product: Product) {
    const modalRef = this.modalService.open(EditModalComponent);
    modalRef.componentInstance.product = product;
  }

  deleteProduct(product: any) {
    this.appService.deleteProduct(product.id).subscribe((data: any) => {
      // @ts-ignore
      _.remove(this.products, function (prd) {
        return product.id === prd.id
      });

      this.productDeletionFail = false;
      this.deleteSuccessMessage = "Product deleted successfully";
      this.setTimer();
    }, error => {
      this.productDeletionFail = true;
      this.deleteFailMessage = "Some problems while deleting the product";
      this.setTimer();
    });

  }

  public setTimer() {
    this.deletionComplete = true;
    this.timer = timer(2000);
    this.timer.subscribe(() => {
      this.deletionComplete = false;
    });
  }

}
