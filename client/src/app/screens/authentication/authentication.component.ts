import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import { AuthService } from "../../service/auth/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"]
})
export class AuthenticationComponent implements OnInit {
  email: string;
  password: string;
  result: Object;
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  authorized: boolean;
  constructor(
    public auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  onEmailChange(event: any) {
    this.email = event.target.value;
  }
  onPasswordChange(event: any) {
    this.password = event.target.value;
  }

  submitLogin() {
    if (this.email && this.password) {
      // More validation here
      this.auth.login(this.email, this.password);
    }
  }
  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.loading = false;
      }
    });
  }
}
