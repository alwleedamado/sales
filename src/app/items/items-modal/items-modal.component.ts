import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-items-modal',
  templateUrl: './items-modal.component.html',
  styleUrls: ['./items-modal.component.scss']
})
export class ItemsModalComponent implements OnInit {
  itemForm: FormGroup;

  constructor() {
    this.itemForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]+\.{1}(?:[0-9\.]{2}){1}')]),
      category: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }
  get name() {
    return this.itemForm.get('name') as FormControl;
  }
  get description() {
    return this.itemForm.get('description') as FormControl;
  }
  get price() {
    return this.itemForm.get('price') as FormControl;
  }

  save() {

  }

  close() {

  }
}
