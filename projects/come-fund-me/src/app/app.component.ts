import { Component } from '@angular/core';
import { NgxWebMonetizer } from 'ngx-webmonetizer';

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
    const detail = {
      paymentPointer: "PAY_ME",
      requestId: '12345',
      amount: '289',
      assetCode: 'USD',
      assetScale: '0.22'
    };

    const event = new CustomEvent("monetizationprogress", { detail });
    (<any> document).monetization.dispatchEvent(event);
  }
}
