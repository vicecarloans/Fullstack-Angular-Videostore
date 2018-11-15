import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth/auth.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getSession();
  }
}
