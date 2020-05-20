import { Injectable, Inject } from '@angular/core';
import { NGX_WEBMONETIZER_CONFIG } from './config/ngx-webmonetizer.config.token';
import { INgxWebMonetizerConfig } from './config/ngx-webmonetizer.config';
import { BehaviorSubject } from 'rxjs';
import { WebMonetizerStatus, IPayment, IPaymentLog} from './types/index';
import { INJECT_META_TAG, REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING } from './utils';
import { MonetizationEvents } from './enums';

@Injectable({ providedIn: 'root' })
export class NgxWebMonetizer {
  public state: BehaviorSubject<WebMonetizerStatus>;
  private senderIdentifier: string;
  public total: BehaviorSubject<number> = new BehaviorSubject(0.00)
  public ledger: BehaviorSubject<IPaymentLog[]> = new BehaviorSubject([]);

  constructor(@Inject(NGX_WEBMONETIZER_CONFIG) private config: INgxWebMonetizerConfig) {
    this.init();
  }

  private async init() {
    this.state = new BehaviorSubject(!(<any> document).monetization ? 'unsupported' : (<any> document).monetization.state);
    this.senderIdentifier = this.config.senderIdentifier || await this.getUserIP() || "Anonymous";

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

  private async getUserIP() {
    let IP: string;

    try {
      const res = await (await fetch('https://api.ipify.org?format=json')).json();
      IP = res["ip"]
    } catch(err) { }

    return IP;
  }

  private addPaymentLog(payment: IPayment) {
    const paymentLog: IPaymentLog = {
      currency: payment.assetCode,
      amount: this.scaleAmountDown(payment.amount, payment.assetScale),
      paymentPointer: payment.paymentPointer,
      requestId: payment.requestId,
      timestamp: new Date().getTime(),
      senderIdentifier: this.senderIdentifier,
      paymentReference: this.config.paymentReference
    }

    const ledger = this.ledger.getValue();
    const previousLogEntryIndex = ledger.findIndex(log => log.senderIdentifier == this.senderIdentifier);

    let previousLogEntry: IPaymentLog;

    if (previousLogEntryIndex > -1) {
      previousLogEntry = ledger[previousLogEntryIndex];
    }

    if (previousLogEntry && ((paymentLog.timestamp - previousLogEntry.timestamp) < 86400)) {
      paymentLog.amount += previousLogEntry.amount;
      ledger.splice(previousLogEntryIndex, 1, paymentLog);
    } else {
      ledger.push(paymentLog);
    }

    this.ledger.next(this.sortLedgerDesc(ledger));
    this.total.next(this.calculateLedgerTotal(ledger));
  }

  private scaleAmountDown(amount: string, scale: number) {
    return Number((Number(amount) * Math.pow(10, -scale)).toFixed(scale));
  }

  private sortLedgerDesc(ledger: IPaymentLog[]) {
    return ledger.sort((a, b) => {
      const [A, B] = [a.timestamp, b.timestamp];

      return (A > B) ? -1 : (B > A) ? 1 : 0;
    });
  }

  private calculateLedgerTotal(ledger: IPaymentLog[]) {
    return ledger.reduce((acc, val) => acc + val.amount, 0.00);
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
    if (!this.config.production) {
      BROWSER_UNSUPPORTED_WARNING();
    }
  }
}
