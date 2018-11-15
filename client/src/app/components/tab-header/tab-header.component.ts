import { Component, OnInit, NgModule } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../models/store.model";
import { Observable } from "rxjs";
import { AdminReducerModel } from "../../models/admin.model";

@Component({
  selector: "app-tab-header",
  templateUrl: "./tab-header.component.html",
  styleUrls: ["./tab-header.component.scss"]
})
export class TabHeaderComponent implements OnInit {
  admin: Observable<AdminReducerModel>;
  authorized: boolean;

  constructor(private store: Store<AppState>) {
    this.admin = this.store.select("admin");
  }

  ngOnInit() {
    this.admin.subscribe(state => {
      this.authorized = state.authorized;
    });
  }
}
