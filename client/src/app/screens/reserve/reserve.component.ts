import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { VideoModel } from "../../models/video.model";
import {
  CustomerModel,
  CustomerModelDropDown
} from "../../models/customer.model";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-reserve",
  templateUrl: "./reserve.component.html",
  styleUrls: ["./reserve.component.scss"]
})
export class ReserveComponent implements OnInit {
  videoId$: Object;
  videoInstance: VideoModel;
  customerList: Array<Object>;
  loading: boolean = true;
  isShow: boolean = false;
  isValid: boolean = false;
  reserveName: string;
  @Input()
  selectedItem: any;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => (this.videoId$ = params.id));
  }
  toggleDropdown() {
    !this.isShow;
  }
  getCurrentItem(event) {
    if (event) {
      this.isValid = true;
    }
  }
  submitLogin() {
    this.api.reserveVideo(this.videoId$, this.selectedItem.id).subscribe(
      res => {
        console.log(res);
        this.router.navigateByUrl("/dashboard");
      },
      err => {
        console.log(err);
      }
    );
  }
  ngOnInit() {
    this.api.getVideoById$(this.videoId$).subscribe(res => {
      this.videoInstance = res;
      this.api.getCustomerInfoDropDown().subscribe(res => {
        this.customerList = res.customers.map(customer => {
          const list = {
            content: `${customer.firstName} ${customer.lastName}`,
            id: customer._id,
            selected: false
          };
          if (this.videoInstance._customerId == customer._id) {
            this.reserveName = list.content;
          }
          return list;
        });

        this.loading = false;
      });
    });
  }
}
