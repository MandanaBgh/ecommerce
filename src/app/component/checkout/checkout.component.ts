import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentYear: number = Number(new Date().getFullYear());
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;
  countries: Country[] = [];
  constructor(private theFormBuilder: FormBuilder,
    private theFormService: FormService,
    private thecartService: CartService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.theFormBuilder.group({
      customer: this.theFormBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
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

    this.theFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
    this.updateCheckOut();
  }
  onSubmit() {
    console.log("The Data On Submit Form");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("the EmailAddress is :" + this.checkoutFormGroup.get('customer').value.email);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

  }
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  cpShipngToBilling(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  updateCheckOut() {
    this.thecartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.thecartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

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


  getState(formGroupName: string) {

    const FormGroup = this.checkoutFormGroup.get(formGroupName);
    const FormGroupCountryCode = FormGroup.value.country.code;
    this.theFormService.getStates(FormGroupCountryCode).subscribe(
      data => {


        if (formGroupName === 'billingAddress') {
          this.billingAddressStates = data;
        } else {
          this.shippingAddressStates = data;
        }
        FormGroup.get('state').setValue(data[0]);

      }



    )

  }
}
