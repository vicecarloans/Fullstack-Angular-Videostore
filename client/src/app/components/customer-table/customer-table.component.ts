import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import {
  CustomerModel,
  CustomerPaginationModel
} from "../../models/customer.model";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api/api.service";
import { Observable, Subscription } from "rxjs";
import {
  TableModel,
  TableItem,
  TableHeaderItem,
  ModalService
} from "carbon-components-angular";

@Component({
  selector: "app-customer-table",
  templateUrl: "./customer-table.component.html",
  styleUrls: ["./customer-table.component.scss"]
})
export class CustomerTableComponent implements OnInit {
  customerListSub: Subscription;
  customerPagination$: CustomerPaginationModel;
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  @Input()
  customerTable = new TableModel();
  @Input()
  get totalDataLength() {
    return this.customerTable.totalDataLength;
  }
  set totalDataLength(value) {
    this.customerTable.totalDataLength = value;
  }
  @ViewChild("customerPaginationUpdate")
  protected customerPaginationUpdate: TemplateRef<any>;
  @ViewChild("customerPaginationDelete")
  protected customerPaginationDelete: TemplateRef<any>;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private api: ApiService,
    private modalService: ModalService
  ) {
    this.admin = this.store.select("admin");
  }
  customSort(index: number) {
    this.sort(this.customerTable, index);
  }

  sort(model, index: number) {
    if (model.header[index].sorted) {
      // if already sorted flip sorting direction
      model.header[index].ascending = model.header[index].descending;
    }
    model.sort(index);
  }
  doFilter(event) {
    const keyword = event.target.value;
    this.customerTable.header = this.generateHeader();
    this.customerTable.data = this.generateBody(
      this.customerPagination$.customers
    ).filter(data => {
      const result = data.reduce((acc, cell, i) => {
        return (
          acc ||
          cell.data
            .toString()
            .toLowerCase()
            .includes(keyword && keyword.toLowerCase())
        );
      }, false);
      return result;
    });
  }
  generateBody(customers: CustomerModel[]) {
    return customers.map(customer => {
      return [
        new TableItem({ data: customer.firstName }),
        new TableItem({ data: customer.lastName }),
        new TableItem({ data: customer.address }),
        new TableItem({ data: customer.city }),
        new TableItem({ data: customer.phoneNumber }),
        new TableItem({ data: customer.status ? "Active" : "Expired" }),
        new TableItem({
          data: customer._id,
          template: this.customerPaginationUpdate
        }),
        new TableItem({
          data: customer._id,
          template: this.customerPaginationDelete
        })
      ];
    });
  }
  generateHeader() {
    return [
      new TableHeaderItem({ data: "First Name" }),
      new TableHeaderItem({ data: "Last Name" }),
      new TableHeaderItem({ data: "Address" }),
      new TableHeaderItem({ data: "City" }),
      new TableHeaderItem({ data: "Phone Number" }),
      new TableHeaderItem({ data: "Status" }),
      new TableHeaderItem({ data: "Update" }),
      new TableHeaderItem({ data: "Delete" })
    ];
  }
  getPage(page: number) {
    const line = data => {
      return data.map(column => {
        return { data: column.data, template: column.template };
      });
    };

    const fullPage = [];
    const allData = this.generateBody(this.customerPagination$.customers);
    for (
      let i = (page - 1) * this.customerTable.pageLength;
      i < page * this.customerTable.pageLength &&
      i < this.customerTable.totalDataLength;
      i++
    ) {
      fullPage.push(line(allData[i]));
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(fullPage), 150);
    });
  }

  selectPage(page) {
    this.getPage(page).then((data: Array<Array<any>>) => {
      this.customerTable.data = this.prepareData(data);
      this.customerTable.currentPage = page;
    });
  }
  protected prepareData(data: Array<Array<any>>) {
    // create new data from the service data
    let newData = [];
    data.forEach(dataRow => {
      let row = [];
      dataRow.forEach(dataElement => {
        row.push(
          new TableItem({
            data: dataElement.data,
            template: dataElement.template
          })
        );
      });
      newData.push(row);
    });
    return newData;
  }
  initTable() {
    this.customerListSub = this.api.getCustomers$().subscribe(
      res => {
        this.customerPagination$ = res;
        this.customerTable.data = this.generateBody(
          this.customerPagination$.customers
        );
        this.customerTable.totalDataLength = this.customerPagination$.count;
        this.selectPage(1);
        this.customerTable.header = this.generateHeader();
        this.loading = false;
      },
      err => console.log(err)
    );
    this.loading = false;
  }

  ngOnInit() {
    this.customerTable.pageLength = 10;
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.initTable();
      }
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.customerListSub.unsubscribe();
  }
}
