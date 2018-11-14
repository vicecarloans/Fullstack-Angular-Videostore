import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
  TabsModule,
  IconModule,
  ButtonModule,
  TableModule,
  PaginationModule,
  InputModule,
  NFormsModule,
  LoadingModule
} from "carbon-components-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TabHeaderComponent } from "./tab-header/tab-header.component";
import { VideoTableComponent } from "./video-table/video-table.component";
import { HttpClientModule } from "@angular/common/http";
import { ApiService } from "./core/api.service";
import { AuthService } from "./auth/auth.service";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./screens/dashboard/dashboard.component";
import { AuthenticationComponent } from "./screens/authentication/authentication.component";
import StoreModule from "./flux/store";
import { ReserveComponent } from './screens/reserve/reserve.component';
@NgModule({
  declarations: [
    AppComponent,
    TabHeaderComponent,
    VideoTableComponent,
    HeaderComponent,
    DashboardComponent,
    AuthenticationComponent,
    ReserveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsModule,
    IconModule,
    ButtonModule,
    TableModule,
    HttpClientModule,
    PaginationModule,
    InputModule,
    NFormsModule,
    FormsModule,
    LoadingModule,
    HttpClientModule,
    StoreModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
