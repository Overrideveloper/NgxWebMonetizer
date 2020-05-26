import { Injectable, Inject } from '@angular/core';
import { NGX_WEBMONETIZER_CONFIG } from './config/ngx-webmonetizer.config.token';
import { INgxWebMonetizerConfig } from './config/ngx-webmonetizer.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { WebMonetizerStatus, IPayment, IPaymentLog} from './types/index';
import { INJECT_META_TAG, REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING } from './utils';
import { MonetizationEvents } from './enums';

@Injectable({ providedIn: 'root' })
export class NgxWebMonetizer {
  public state: BehaviorSubject<WebMonetizerStatus>;
  public newPayment: Subject<IPaymentLog> = new Subject();

  constructor(@Inject(NGX_WEBMONETIZER_CONFIG) private config: INgxWebMonetizerConfig) {
    this.initialize();
  }

  private async initialize() {
    this.state = new BehaviorSubject(!(<any> document).monetization ? 'unsupported' : (<any> document).monetization.state);

    if ((<any> document).monetization) {
      (<any> document).monetization.addEventListener(MonetizationEvents.START, () => this.state.next("started"));
      (<any> document).monetization.addEventListener(MonetizationEvents.PENDING, () => this.state.next("pending"));
      (<any> document).monetization.addEventListener(MonetizationEvents.STOP, () => this.state.next("stopped"));

      (<any> document).monetization.addEventListener(MonetizationEvents.PROGRESS, (event: CustomEvent) => {
        const _event = new CustomEvent(MonetizationEvents.START);
        (<any> document).monetization.dispatchEvent(_event);

        this.addPaymentLog(<IPayment> event.detail);
      });
    }
  }

  private async addPaymentLog(payment: IPayment) {
    const paymentLog: IPaymentLog = {
      currency: payment.assetCode,
      amount: this.scaleAmountDown(payment.amount, payment.assetScale),
      paymentPointer: payment.paymentPointer,
      requestId: payment.requestId
    }

    this.newPayment.next(paymentLog);
  }

  private scaleAmountDown(amount: string, scale: number) {
    return Number((Number(amount) * Math.pow(10, -scale)).toFixed(scale));
  }

  public stop() {
    if ((<any> document).monetization) {
      REMOVE_META_TAG();

      const event = new CustomEvent(MonetizationEvents.STOP);
      (<any> document).monetization.dispatchEvent(event);
    } else {
      this.throwBrowserUnsupportedWarning();
    }
  }

  public start() {
    if ((<any> document).monetization) {
      INJECT_META_TAG(this.config.paymentPointer);

      const event = new CustomEvent(MonetizationEvents.PENDING);
      (<any> document).monetization.dispatchEvent(event);
    } else {
      this.throwBrowserUnsupportedWarning();
    }
  }

  private throwBrowserUnsupportedWarning() {
    if (!this.config.disableLogs) {
      BROWSER_UNSUPPORTED_WARNING();
    }
  }
}
