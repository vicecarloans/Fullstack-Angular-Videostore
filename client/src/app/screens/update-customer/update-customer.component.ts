import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Route } from "@angular/router";
import { AdminReducerModel } from "../../models/admin.model";
import { CustomerModel, CustomerFormModel } from "../../models/customer.model";
import { AppState } from "../../models/store.model";
import { ApiService } from "../../service/api/api.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  FormGroup,
  ValidatorFn,
  AbstractControl,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-update-customer",
  templateUrl: "./update-customer.component.html",
  styleUrls: ["./update-customer.component.scss"]
})
export class UpdateCustomerComponent implements OnInit {
  customerId$: string;
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  authorized: boolean = true;
  isFormValid: boolean = false;
  imageUpload: any;
  imageFile: any;
  submitting: boolean = false;
  isSelectionInvalid: boolean = false;
  @Input()
  customerModel: CustomerFormModel;
  customerForm: FormGroup;
  selectedStatus: any;
  statusList: Array<{
    content:string;
    actualContent: boolean;
    selected: boolean;
  }> = [
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



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private api: ApiService
  ) {
    this.route.params.subscribe(params=>{
      this.customerId$ = params.id;
    });
  }


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
      this.api.updateCustomer(this.customerId$, data).subscribe(
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


  inputNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return isNaN(control.value) ? { isNotNumber: true } : null;
    };
  }

  getCustomer() {
    this.api.getCustomerById$(this.customerId$).subscribe(res => {
      this.customerModel = res;
      console.log(this.customerModel)
      this.customerForm = new FormGroup({
        firstName: new FormControl(this.customerModel.firstName, [Validators.required]),
        lastName: new FormControl(this.customerModel.lastName, [Validators.required]),
        city: new FormControl(this.customerModel.city, [Validators.required]),
        address: new FormControl(this.customerModel.address, [Validators.required]),
        phoneNumber: new FormControl(this.customerModel.phoneNumber, [Validators.required, this.inputNumberValidator()]),
      });
      this.statusList.forEach(status => {
        if (status.actualContent == this.customerModel.status) {
          this.selectedStatus = { ...status, selected: true };
        }
      });
      this.loading = false;
    });
  }
  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.getCustomer();
      }
    });
  }
}
