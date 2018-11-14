import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"]
})
export class AuthenticationComponent implements OnInit {
  email: string;
  password: string;
  result: Object;
  constructor(public auth: AuthService) {}

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
  ngOnInit() {}
}
