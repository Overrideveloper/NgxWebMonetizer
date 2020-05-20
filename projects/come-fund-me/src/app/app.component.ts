import { Component } from '@angular/core';
import { NgxWebMonetizer } from 'ngx-webmonetizer';

interface IPayment {
  paymentPointer: string;
  requestId: string;
  amount: string;
  assetCode: string;
  assetScale: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Come Fund Me';

  constructor(public ngxMonetizer: NgxWebMonetizer) {
    ngxMonetizer.state.subscribe(val => console.log(val));
  }

  start() {
    this.ngxMonetizer.start();
  }

  stop() {
    this.ngxMonetizer.stop();
  }

  progress() {
    const detail: IPayment = {
      paymentPointer: "PAY_ME",
      requestId: '12345',
      amount: '289',
      assetCode: 'USD',
      assetScale: 2
    };

    const event = new CustomEvent("monetizationprogress", { detail });
    (<any> document).monetization.dispatchEvent(event);
  }

  convertToDate(time: number) {
    return new Date(time).toDateString();
  }
}
