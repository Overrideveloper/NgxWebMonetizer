import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WebMonetizerStatus, IPayment, IProgressEventDetail} from './types/index';
import { INJECT_META_TAG, REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING } from './utils';
import { MonetizationEvents } from './enums';

@Injectable()
export class NgxWebMonetizer {
  public state: BehaviorSubject<WebMonetizerStatus>;
  public newPayment: Subject<IPayment> = new Subject();

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.state = new BehaviorSubject(!(<any> document).monetization ? 'unsupported' : (<any> document).monetization.state);

    if ((<any> document).monetization) {
      (<any> document).monetization.addEventListener(MonetizationEvents.START, () => this.state.next("started"));
      (<any> document).monetization.addEventListener(MonetizationEvents.PENDING, () => this.state.next("pending"));
      (<any> document).monetization.addEventListener(MonetizationEvents.STOP, () => this.state.next("stopped"));
      (<any> document).monetization.addEventListener(MonetizationEvents.PROGRESS, (event: CustomEvent) => this.emitNewPayment(<IProgressEventDetail> event.detail));
    }
  }

  private async emitNewPayment(detail: IProgressEventDetail) {
    const payment: IPayment = {
      currency: detail.assetCode,
      amount: this.scaleAmountDown(detail.amount, detail.assetScale),
      paymentPointer: detail.paymentPointer,
      requestId: detail.requestId
    }

    this.newPayment.next(payment);
  }

  private scaleAmountDown(amount: string, scale: number) {
    return Number((Number(amount) * Math.pow(10, -scale)).toFixed(scale));
  }

  public stop() {
    if ((<any> document).monetization) {
      REMOVE_META_TAG();
    } else {
      BROWSER_UNSUPPORTED_WARNING();
    }
  }

  public start(paymentPointer: string) {
    if ((<any> document).monetization) {
      INJECT_META_TAG(paymentPointer);
    } else {
      BROWSER_UNSUPPORTED_WARNING();
    }
  }
}
