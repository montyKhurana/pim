import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './services/app.service';
import { AppHttpInterceptorService } from './services/http-interceptor.service';
import {RoutingModule} from "./routing/routing.module";

import { HeaderComponent } from './header/header.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AngularFontAwesomeModule} from "angular-font-awesome";
import { ProductListComponent } from './product/product-list/product-list.component';
import {EditModalComponent} from "./edit-modal/edit-modal.component";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductCreateComponent,
    ProductListComponent,
    EditModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Csrf-Token',
      headerName: 'Csrf-Token',
    }),
    RoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    NgbModalModule
  ],
  entryComponents: [EditModalComponent],
  providers: [
    AppService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService
    }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}
