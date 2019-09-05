import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Details, Product} from "../models/product";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  @Input() product: Product | undefined;

  constructor(public activeModal: NgbActiveModal, private router: Router) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/product-list']));
  }
}
