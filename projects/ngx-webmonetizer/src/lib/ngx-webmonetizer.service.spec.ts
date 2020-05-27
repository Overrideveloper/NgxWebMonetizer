import { NgxWebMonetizer } from './ngx-webmonetizer.service';
import { MonetizationEvents } from './enums';
import { IPayment } from './types';

const PAYMENT_POINTER = 'RANDOM_STRING';
const BROWSER_UNSUPPORTED_WARNING = 'Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser';

let ngxWebMonetizer: NgxWebMonetizer;

describe('NgxWebmonetizerService', () => {
  function initialize() {
    ngxWebMonetizer = new NgxWebMonetizer();
  }

  function mockMonetization() {
    document["monetization"] = document.createDocumentFragment();
    document["monetization"]["state"] = "stopped";
    document["monetization"]["_requestId"] = "fc23b14d-70e4-4d55-b0a0-dd86f70ce402'";
  }

  function removeMonetizationMock() {
    document["monetization"] = undefined;
  }

  afterEach(() => {
    removeMonetizationMock();
  });

  it('should be created', () => {
    initialize();
    expect(ngxWebMonetizer).toBeTruthy();
  });

  it('should set first state to `unsupported`', () => {
    initialize();
    expect(ngxWebMonetizer.state.getValue()).toBe('unsupported');
  });

  it('should set first state to `stopped`', () => {
    mockMonetization();
    initialize();
    expect(ngxWebMonetizer.state.getValue()).toBe('stopped');
  });

  it('should inject meta tag if `start` is called and monetization is supported', () => {
    mockMonetization();
    initialize();
    ngxWebMonetizer.start(PAYMENT_POINTER);

    const metaTag: HTMLMetaElement = document.querySelector('meta[name="monetization"]');

    expect(metaTag).toBeTruthy();
    expect(metaTag.content).toBe(PAYMENT_POINTER);
  });

  it('should output BROWSER_UNSUPPORTED_WARNING if `start` is called and monetization is unsupported', () => {
    initialize();
    spyOn(window.console, 'warn');
    ngxWebMonetizer.start(PAYMENT_POINTER);

    expect(window.console.warn).toHaveBeenCalledTimes(1);
    expect(window.console.warn).toHaveBeenCalledWith(BROWSER_UNSUPPORTED_WARNING);
  });

  it('should remove meta tag if `stop` is called and monetization is supported', () => {
    mockMonetization();
    initialize();
    ngxWebMonetizer.start(PAYMENT_POINTER);

    let metaTag: HTMLMetaElement = document.querySelector('meta[name="monetization"]');

    expect(metaTag).toBeTruthy();

    ngxWebMonetizer.stop();

    metaTag = document.querySelector('meta[name="monetization"]');

    expect(metaTag).toBeFalsy();
  });

  it('should output BROWSER_UNSUPPORTED_WARNING if `stop` is called and monetization is unsupported', () => {
    initialize();
    spyOn(window.console, 'warn');
    ngxWebMonetizer.stop();

    expect(window.console.warn).toHaveBeenCalledTimes(1);
    expect(window.console.warn).toHaveBeenCalledWith(BROWSER_UNSUPPORTED_WARNING);
  });

  it('should set state to `started` on START monetization event', () => {
    mockMonetization();
    initialize();

    const event = new CustomEvent(MonetizationEvents.START);
    document["monetization"].dispatchEvent(event);

    expect(ngxWebMonetizer.state.getValue()).toBe('started');
  });

  it('should set state to `pending` on PENDING monetization event', () => {
    mockMonetization();
    initialize();

    const event = new CustomEvent(MonetizationEvents.PENDING);
    document["monetization"].dispatchEvent(event);

    expect(ngxWebMonetizer.state.getValue()).toBe('pending');
  });

  it('should set state to `stopped` on STOP monetization event', () => {
    mockMonetization();
    initialize();

    const event = new CustomEvent(MonetizationEvents.STOP);
    document["monetization"].dispatchEvent(event);

    expect(ngxWebMonetizer.state.getValue()).toBe('stopped');
  });

  it('should emit new payment object on PROGRESS monetization event', () => {
    mockMonetization();
    initialize();

    let payment;

    ngxWebMonetizer.newPayment.subscribe(_payment => payment = _payment);

    const detail = {
      paymentPointer: PAYMENT_POINTER,
      requestId: document["monetization"]._requestId,
      amount: String(Math.floor(30000 + Math.random() * 100000)),
      assetCode: 'USD',
      assetScale: 9
    };

    const expectedPayment: IPayment = {
      amount: Number((Number(detail.amount) * Math.pow(10, -detail.assetScale)).toFixed(detail.assetScale)),
      currency: detail.assetCode,
      paymentPointer: PAYMENT_POINTER,
      requestId: document["monetization"]._requestId
    };

    const event = new CustomEvent("monetizationprogress", { detail });
    document["monetization"].dispatchEvent(event);

    expect(payment).toBeTruthy();
    expect(payment).toEqual(expectedPayment);
  });
});
