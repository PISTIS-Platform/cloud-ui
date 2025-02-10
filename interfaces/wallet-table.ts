export interface Transaction {
    id: string;
    transactionDate: Date;
    transactionId: string;
    amount: number;
    type?: string;
    seller?: string;
    buyer?: string;
    assetId?: string;
    assetTitle?: string;
    assetLink?: string;
    terms?: string;
}

export interface Balance {
    amount: number;
}
