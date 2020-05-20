import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxWebmonetizerModule } from 'ngx-webmonetizer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWebmonetizerModule.forRoot({
      paymentPointer: "PAY_ME",
      automatic: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
