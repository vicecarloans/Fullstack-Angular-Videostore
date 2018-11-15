import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./screens/dashboard/dashboard.component";
import { AuthenticationComponent } from "./screens/authentication/authentication.component";
import { ReserveComponent } from "./screens/reserve/reserve.component";
import { CreateVideoComponent } from "./screens/create-video/create-video.component";
const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "login", component: AuthenticationComponent },
  { path: "reserve/:id", component: ReserveComponent },
  { path: "videos/create", component: CreateVideoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
