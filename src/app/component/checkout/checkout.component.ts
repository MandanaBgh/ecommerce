import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentYear: number = Number(new Date().getFullYear());

  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;
  constructor(private theFormBuilder: FormBuilder,
    private theFormService: FormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.theFormBuilder.group({
      customer: this.theFormBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.theFormBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.theFormBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.theFormBuilder.group({
        cardType: [''],
        cardName: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.theFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYear = data;
      }
    );

    this.getNextMonths(Number(new Date().getMonth()) + 1);

  }
  onSubmit() {
    console.log("The Data On Submit Form");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("the EmailAddress is :" + this.checkoutFormGroup.get('customer').value.email);
  }


  cpShipngToBilling(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }
  onChangeYear() {

    const theFormGroupName = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = theFormGroupName.value.expirationYear;
    let currentMonth: number = Number(new Date().getMonth()) + 1;

    if (selectedYear == this.currentYear) {

      currentMonth = Number(new Date().getMonth()) + 1;
      console.log("currentMonth should Not be changed : " + currentMonth);
    } else {

      currentMonth = 1;

    }

    this.getNextMonths(currentMonth);

  }

  private getNextMonths(themonth: number) {

    this.theFormService.getCreditMonths(themonth).subscribe(
      data => {
        this.creditCardMonth = data;
      }
    );
  }
}