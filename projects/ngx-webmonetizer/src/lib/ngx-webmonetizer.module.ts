import { NgModule, ModuleWithProviders } from '@angular/core';
import { BROWSER_UNSUPPORTED_WARNING } from './utils';
import { NgxWebMonetizer } from './ngx-webmonetizer.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class NgxWebmonetizerModule {
  static initialize(): ModuleWithProviders {
    if (!(<any> document).monetization) {
      BROWSER_UNSUPPORTED_WARNING();
    }

    return {
      ngModule: NgxWebmonetizerModule,
      providers: [NgxWebMonetizer]
    };
  }
}
