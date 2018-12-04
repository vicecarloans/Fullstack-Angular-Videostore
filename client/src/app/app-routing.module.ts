import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./screens/dashboard/dashboard.component";
import { AuthenticationComponent } from "./screens/authentication/authentication.component";
import { ReserveComponent } from "./screens/reserve/reserve.component";
import { CreateVideoComponent } from "./screens/create-video/create-video.component";
import { UpdateVideoComponent } from "./screens/update-video/update-video.component";
import { CreateCustomerComponent } from "./screens/create-customer/create-customer.component"
import { UpdateCustomerComponent } from "./screens/update-customer/update-customer.component";

const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "login", component: AuthenticationComponent },
  { path: "reserve/:id", component: ReserveComponent },
  { path: "videos/create", component: CreateVideoComponent },
  { path: "update/video/:id", component: UpdateVideoComponent },
  { path: "customers/create", component: CreateCustomerComponent},
  { path: "update/customer/:id", component: UpdateCustomerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
