# NgxWebMonetizer Quickstart

### 1. Create a new project

```
npm install -g @angular/cli
ng new <project-name>
cd <project-name>
```
The Angular CLI's new command will set up the latest Angular build in a new project structure.

### 2. Install NgxWebMonetizer
`npm install ngx-webmonetizer`

Now that you have a new project setup, install NgxWebMonetizer from npm.

### 3. Setup `@NgModule` for the `NgxWebMonetizerModule`
Open `/src/app/app.module.ts` and import the `NgxWebMonetizerModule`.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxWebmonetizerModule } from 'ngx-webmonetizer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxWebmonetizerModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

```

### 4. Inject `NgxWebMonetizer`
Open `/src/app/app.component.ts`, and make sure to modify/delete any tests to get the sample working.

```typescript
import { Component } from '@angular/core';
import { NgxWebMonetizer } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  constructor(monetizer: NgxWebMonetizer) {

  }
}
```

### 5. Bind the Monetization State to a class member
In `/src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  monetizationState: WebMonetizerState;

  constructor(monetizer: NgxWebMonetizer) {
    monetizer.state.subscribe(state => this.monetizationState = state);
  }
}
```

In `/src/app/app.component.html`:
```html
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>
    </div>
```

`monetizer.state` is a `BehaviourSubject` that emits the current monetization state.

There are 4 monetization states in NgxWebMonetizer:
- **unsupported**: The browser does not support Web Monetization.
- **pending**: NgxWebMonetizer is trying to send payments but is yet to send the first non-zero micropayment.
- **started**: NgxWebMonetizer is currently sending micropayments.
- **stopped**: NgxWebMonetizer can send payments but is not currently sending micropayments nor trying to.
<br/> This is the default monetization state when you inject `NgxWebMonetizer` (if the browser supports Web Monetization).

### 6. Store Micropayment information in a list
In `/src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  monetizationState: WebMonetizerState;
  payments: IWebMonetizerPayment[] = [];

  constructor(monetizer: NgxWebMonetizer) {
    monetizer.state.subscribe(state => this.monetizationState = state);
    monetizer.newPayment.subscribe(payment => this.payments.push(payment));
  }
}
```

In `/src/app/app.component.html`:
```html
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>

        <h6>Payments</h6>
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
```

`monetizer.newPayment` is a `Subject` that emits micropayments as they are streamed.

The attributes of a micropayment are:
- **currency**: A three-letter code that describes the currency of the micropayment, like `USD`, `EUR` or `XRP`.
<br/> This is usually the same for all micropayments made to the same payment pointer.

- **amount**: The value of the micropayment.
- **requestId**: A unique session ID for the payment session.
- **paymentPointer**: Your unique payment account URL.

### 7. Start Monetization
In `/src/app/app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  monetizationState: WebMonetizerState;
  payments: IWebMonetizerPayment[] = [];

  constructor(private monetizer: NgxWebMonetizer) {
    monetizer.state.subscribe(state => this.monetizationState = state);
    monetizer.newPayment.subscribe(payment => this.payments.push(payment));
  }

  ngOnInit() {
    this.startStreamingPayments();
  }

  startStreamingPayments() {
    this.monetizer.start('YOUR_PAYMENT_POINTER');
  }
}
```

In `/src/app/app.component.html`:
```html
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>

        <button (click)="startStreamingPayments()">Start</button>

        <h6>Payments</h6>
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
```

When `monetizer.start` is called, providing a unique payment account URL (payment pointer), the browser resolves a unique receiving address and begins sending payments or tries to. The web monetization state is also set to `started`.

### 8. Stop Monetization
In `/src/app/app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  monetizationState: WebMonetizerState;
  payments: IWebMonetizerPayment[] = [];

  constructor(private monetizer: NgxWebMonetizer) {
    monetizer.state.subscribe(state => this.monetizationState = state);
    monetizer.newPayment.subscribe(payment => this.payments.push(payment));
  }

  ngOnInit() {
    this.startStreamingPayments();
  }

  startStreamingPayments() {
    this.monetizer.start('YOUR_PAYMENT_POINTER');
  }

  stopStreamingPayments() {
    this.monetizer.stop();
  }
}
```

In `/src/app/app.component.html`:
```html
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>

        <button (click)="startStreamingPayments()">Start</button>
        <button (click)="stopStreamingPayments()">Stop</button>

        <h6>Payments</h6>
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
```

When `monetizer.stop` is called, the browser stops streaming payments or trying to. The web monetization state is also set to `stopped`.

### 9. Display payment total counter
In `/src/app/app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { NgxWebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'ngx-webmonetizer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
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

  ngOnInit() {
    this.startStreamingPayments();
  }

  startStreamingPayments() {
    this.monetizer.start('YOUR_PAYMENT_POINTER');
  }

  stopStreamingPayments() {
    this.monetizer.stop();
  }
}
```

In `/src/app/app.component.html`:
```html
    <div>
        <h5>Monetization State => {{ monetizationState }}</h5>
        <h6>Total => {{ currency }} {{ total }}</h6>

        <button (click)="startStreamingPayments()">Start</button>
        <button (click)="stopStreamingPayments()">Stop</button>

        <h6>Payments</h6>
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
```


### 10. Run your app locally
```
ng serve
```