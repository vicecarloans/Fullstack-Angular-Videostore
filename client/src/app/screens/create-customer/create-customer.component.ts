import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild
} from "@angular/core";

import { Store, select } from "@ngrx/store";
import { AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import { CustomerFormModel } from "../../models/customer.model";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api/api.service";
import {
  FormGroup,
  FormControl,
  Validators,
  NgForm,
  AbstractControl,
  ValidatorFn
} from "@angular/forms";




@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  authorized: boolean;
  isFormValid: boolean = false;
  imageUpload: any;
  imageFile: any;
  submitting: boolean = false;
  isSelectionInvalid: boolean = false;
  @Input()
  customerModel: CustomerFormModel = new CustomerFormModel();
  customerForm: FormGroup;
  selectedStatus: any;
  statusList: Array<Object> = [
    {
      content: "Active",
      actualContent: true,
      selected: true
    },
    {
      content: "Inactive",
      actualContent: false,
      selected: false
    }
  ];
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private api: ApiService
  ) {}

  onSubmit() {
    if (
      this.firstName&&
      this.customerForm.valid &&
      this.selectedStatus
    ) {
      const data = { 
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        address: this.address.value,
        city: this.city.value,
        phoneNumber: this.phoneNumber.value,
        status: this.selectedStatus.actualContent
      };
      this.submitting = true;
      this.api.createCustomer(data).subscribe(
        res => {
          console.log(res);
          this.router.navigateByUrl("/dashboard");
        },
        err => console.log(err)
      );
    } else {
      this.isSelectionInvalid = true;
    }
  }

//
  

  getUrl() {
    return this.imageUpload
      ? `url(${this.imageUpload})`
      : `url('../../../assets/profile.png')`;
  }
  get firstName() {
    return this.customerForm.get("firstName");
  }
  get lastName() {
    return this.customerForm.get("lastName");
  }
  get city() {
    return this.customerForm.get("city");
  }

  get address() {
    return this.customerForm.get("address");
  }


  get phoneNumber() {
    return this.customerForm.get("phoneNumber");
  }

  inputNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return isNaN(control.value) ? { isNotNumber: true } : null;
    };
  }

 
  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.loading = false;
      }
    });
    this.customerForm = new FormGroup({
      firstName: new FormControl(this.customerModel.firstName, [Validators.required]),
      lastName: new FormControl(this.customerModel.lastName, [Validators.required]),
      city: new FormControl(this.customerModel.city, [Validators.required]),
      address: new FormControl(this.customerModel.address, [Validators.required]),
      phoneNumber: new FormControl(this.customerModel.phoneNumber, [Validators.required, this.inputNumberValidator()]),
    });
  }

}
