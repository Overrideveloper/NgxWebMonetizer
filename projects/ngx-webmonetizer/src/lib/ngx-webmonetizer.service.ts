import { Injectable, Inject } from '@angular/core';
import { NGX_WEBMONETIZER_CONFIG } from './config/ngx-webmonetizer.config.token';
import { INgxWebMonetizerConfig } from './config/ngx-webmonetizer.config';
import { BehaviorSubject } from 'rxjs';
import { WebMonetizerStatus} from './types/index';
import { INJECT_META_TAG, REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING } from './utils';
import { MonetizationEvents } from './enums';

@Injectable({ providedIn: 'root' })
export class NgxWebMonetizer {
  state: BehaviorSubject<WebMonetizerStatus>;

  constructor(@Inject(NGX_WEBMONETIZER_CONFIG) private config: INgxWebMonetizerConfig) {
    this.init();
  }

  private init() {
    this.state = new BehaviorSubject(!(<any> document).monetization ? 'unsupported' : (<any> document).monetization.state);

    if ((<any> document).monetization) {
      (<any> document).monetization.addEventListener(MonetizationEvents.START, () => this.state.next("started"));
      (<any> document).monetization.addEventListener(MonetizationEvents.PENDING, () => this.state.next("pending"));
      (<any> document).monetization.addEventListener(MonetizationEvents.STOP, () => this.state.next("stopped"));

      (<any> document).monetization.addEventListener(MonetizationEvents.PROGRESS, (_event: any) => {
        const event = new CustomEvent(MonetizationEvents.START);
        (<any> document).monetization.dispatchEvent(event);
        console.log(_event.detail);
      });
    }
  }

  stop() {
    if ((<any> document).monetization) {
      REMOVE_META_TAG();

      const event = new CustomEvent(MonetizationEvents.STOP);
      (<any> document).monetization.dispatchEvent(event);
    } else {
      this.throwBrowserUnsupportedWarning();
    }
  }

  start() {
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
