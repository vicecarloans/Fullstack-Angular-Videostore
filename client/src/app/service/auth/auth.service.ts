import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { LOGGING_IN, LOGGED_IN, LOGGED_OUT } from "../../flux/admin";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  throwError as ObservableThrowError,
  Observable,
  BehaviorSubject
} from "rxjs";
import { TokenModel, AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import { StatusResponseModel } from "../../models/status-response.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userProfile: any;
  expiresAt: number;
  admin: Observable<AdminReducerModel>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.admin = store.select("admin");
  }
  login(email: string, password: string) {
    this.store.dispatch({ type: LOGGING_IN });
    return this.http
      .post<StatusResponseModel>(
        "http://localhost:5000/auth/login",
        {
          email,
          password
        },
        { withCredentials: true }
      )
      .subscribe(
        res => this.getSession(),
        err => {
          this._handleError(err);
        }
      );
  }
  getSession() {
    return this.http
      .get<TokenModel>("http://localhost:5000/api/user/", {
        withCredentials: true
      })
      .subscribe(
        res => {
          this._setSession(res);

          this.router.navigate(["/"]);
        },
        err => {
          this._handleError(err);
        }
      );
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.store.dispatch({ type: value ? LOGGED_IN : LOGGED_OUT });
  }

  private _setSession(result: TokenModel) {
    this.expiresAt = result.exp;
    localStorage.setItem("expires_at", result.exp.toString());
    this.userProfile = result.admin;
    this.setLoggedIn(true);
  }

  logout() {
    this.store.dispatch({ type: LOGGING_IN });
    return this.http
      .get("http://localhost:5000/auth/logout", { withCredentials: true })
      .subscribe(
        res => {
          this._clearExpiration();
          this.setLoggedIn(false);
          this.userProfile = null;

          this.router.navigate(["/"]);
        },
        err => {
          this._handleError(err);
        }
      );
  }

  private _clearExpiration() {
    // Remove token expiration from localStorage
    localStorage.removeItem("expires_at");
  }
  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || "Error: Unable to complete request.";
    // if (err.status && err.status == 401) {
    //   this.auth.login();
    // }

    console.log(err);
    return ObservableThrowError(errorMsg);
  }
}
