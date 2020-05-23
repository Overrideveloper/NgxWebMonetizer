export type WebMonetizerStatus = 'unsupported' | 'pending' | 'started' | 'stopped'

export interface IPayment {
    paymentPointer: string;
    requestId: string;
    amount: string;
    assetCode: string;
    assetScale: number;
}

export interface IPaymentLog {
    currency: string;
    amount: number;
    requestId: string;
    paymentPointer: string;
}