import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-items-modal',
  templateUrl: './items-modal.component.html',
  styleUrls: ['./items-modal.component.scss']
})
export class InvoiceModalComponent implements OnInit {
  invoiceForm: FormGroup;

  constructor() {
    this.invoiceForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }
  get name() {
    return this.invoiceForm.get('name') as FormControl;
  }
  get description() {
    return this.invoiceForm.get('description') as FormControl;
  }
  get price() {
    return this.invoiceForm.get('price') as FormControl;
  }

  save() {

  }

  close() {

  }
}
