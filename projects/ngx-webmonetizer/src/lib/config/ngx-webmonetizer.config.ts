export interface INgxWebMonetizerConfig {
    paymentPointer: string;
    automatic: boolean;
    paymentReference: string;
    senderIdentifier?: string;
    production?: boolean;
}