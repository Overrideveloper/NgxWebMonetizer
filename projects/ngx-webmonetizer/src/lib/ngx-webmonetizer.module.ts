import { NgModule, ModuleWithProviders } from '@angular/core';
import { INgxWebMonetizerConfig } from './config/ngx-webmonetizer.config';
import { NGX_WEBMONETIZER_CONFIG } from './config/ngx-webmonetizer.config.token';
import { INJECT_META_TAG, BROWSER_UNSUPPORTED_WARNING } from './utils';
import { MonetizationEvents } from './enums';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class NgxWebmonetizerModule {
  static forRoot(config: INgxWebMonetizerConfig): ModuleWithProviders {
    if (!(<any> document).monetization && !config.production) {
      BROWSER_UNSUPPORTED_WARNING();
    }

    if (config.automatic) {
      INJECT_META_TAG(config.paymentPointer);
      const event = new CustomEvent(MonetizationEvents.PENDING);
      (<any> document).monetization.dispatchEvent(event);
    }

    return {
      ngModule: NgxWebmonetizerModule,
      providers: [
        { provide: NGX_WEBMONETIZER_CONFIG, useValue: config }
      ]
    };
  }

  static forChild(config: INgxWebMonetizerConfig): ModuleWithProviders {
    if (!(<any> document).monetization && !config.production) {
      BROWSER_UNSUPPORTED_WARNING();
    }

    if (config.automatic) {
      INJECT_META_TAG(config.paymentPointer);
      const event = new CustomEvent(MonetizationEvents.PENDING);
      (<any> document).monetization.dispatchEvent(event);
    }

    return {
      ngModule: NgxWebmonetizerModule,
      providers: [
        { provide: NGX_WEBMONETIZER_CONFIG, useValue: config }
      ]
    };
  }
}
