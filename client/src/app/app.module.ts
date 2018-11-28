import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  TabsModule,
  IconModule,
  ButtonModule,
  TableModule,
  PaginationModule,
  InputModule,
  NFormsModule,
  LoadingModule,
  TilesModule,
  DropdownModule,
  NotificationModule,
  ModalModule,
  PlaceholderModule,
  StaticIconModule
} from "carbon-components-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TabHeaderComponent } from "./components/tab-header/tab-header.component";
import { VideoTableComponent } from "./components/video-table/video-table.component";
import { HttpClientModule } from "@angular/common/http";
import { ApiService } from "./service/api/api.service";
import { AuthService } from "./service/auth/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "./components/header/header.component";
import { DashboardComponent } from "./screens/dashboard/dashboard.component";
import { AuthenticationComponent } from "./screens/authentication/authentication.component";
import StoreModule from "./flux/store";
import { ReserveComponent } from "./screens/reserve/reserve.component";
import { CreateVideoComponent } from "./screens/create-video/create-video.component";
import { UpdateVideoComponent } from "./screens/update-video/update-video.component";
import { CustomerTableComponent } from "./components/customer-table/customer-table.component";
import { CreateCustomerComponent } from './screens/create-customer/create-customer.component';
import { UpdateCustomerComponent } from './screens/update-customer/update-customer.component';
@NgModule({
  declarations: [
    AppComponent,
    TabHeaderComponent,
    VideoTableComponent,
    HeaderComponent,
    DashboardComponent,
    AuthenticationComponent,
    ReserveComponent,
    CreateVideoComponent,
    UpdateVideoComponent,
    CustomerTableComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent
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
    StoreModule,
    TilesModule,
    DropdownModule,
    ReactiveFormsModule,
    NotificationModule,
    ModalModule,
    PlaceholderModule,
    BrowserAnimationsModule,
    StaticIconModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
