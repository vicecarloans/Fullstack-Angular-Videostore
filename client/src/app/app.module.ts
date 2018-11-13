import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  TabsModule,
  IconModule,
  ButtonModule,
  TableModule
} from "carbon-components-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TabHeaderComponent } from "./tab-header/tab-header.component";
import { VideoTableComponent } from "./video-table/video-table.component";
import { HttpClientModule } from "@angular/common/http";
import { ApiService } from "./core/api.service";

@NgModule({
  declarations: [AppComponent, TabHeaderComponent, VideoTableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabsModule,
    IconModule,
    ButtonModule,
    TableModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
