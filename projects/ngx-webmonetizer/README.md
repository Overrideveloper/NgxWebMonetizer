# NgxWebmonetizer
A Web Monetization library for Angular.

```
npm install ngx-webmonetizer
```

# What is Web Monetization?
Web Monetization is a proposed API standard that allows websites to request a stream of very small payments from a user. Read more on Web Monetization [here](https://webmonetization.org/docs/explainer).

# What is NgxWebmonetizer?
NgxWebmonetizer is a library that provides a quick and easy way to add Web Monetization to your Angular web apps.

# Quickstart
Add Web Monetization to your first application by following [the quickstart guide](docs/quickstart.md).

# Example use:
```typescript
import { Component } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  template: `
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>
        <h6>Total => {{ currency }} {{ total }}</h6>

        <button (click)="startStreamingPayments()">Start Streaming Payments</button>
        
        <button (click)="stopStreamingPayments()">Stop Streaming Payments</button>

        <ol>
            <li *ngFor="let payment of payments">
                <ul>
                    <li>Amount: {{ payment.currency }} {{ payment.amount }}</li>
                    <li>Request ID: {{ payment.requestId }}</li>
                    <li>Payment Pointer: {{ payment.paymentPointer }}</li>
                </ul>
            </li>
        </ol>
    </div>
  `
})
export class MyApp {
    monetizationState: WebMonetizerState;
    payments: IWebMonetizerPayment[] = [];
    currency: string;
    total: number = 0;

    constructor(private monetizer: NgxWebMonetizer) {
        monetizer.state.subscribe(state => this.monetizationState = state);
        monetizer.newPayment.subscribe(payment => {
            this.payments.push(payment);
            this.total += payment.amount;

            if (!this.currency) {
                this.currency = payment.currency;
            }
        });
    }

    startStreamingPayments() {
        this.monetizer.start('YOUR_PAYMENT_POINTER');
    }

    stopStreamingPayments() {
        this.monetizer.stop;
    }
}

```

# Resources
[Stackblitz Template](https://stackblitz.com/edit/ngx-webmonetizer-demo) - Remember to import the NgxWebmonetizerModule in `app/app.module.ts`

[Demo Application](https://comefundme-9957f.web.app)