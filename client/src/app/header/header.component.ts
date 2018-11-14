import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { AdminReducerModel } from "../core/models/admin.model";
import { AppState } from "../core/models/store.model";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  admin: Observable<AdminReducerModel>;
  loading: boolean;
  authorized: boolean;
  constructor(
    private router: Router,
    public auth: AuthService,
    private store: Store<AppState>
  ) {}

  handleLoginClick() {
    this.router.navigate(["/login"]);
  }
  handleLogoutClick() {
    this.auth.logout();
  }
  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      this.loading = v.loading;
      this.authorized = v.authorized;
    });
  }
}
