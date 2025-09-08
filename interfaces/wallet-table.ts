export interface Transaction {
    id: string;
    transactionDate: Date;
    transactionId: string;
    amount: number;
    type?: string;
    seller?: string;
    buyer?: string;
    assetId?: string;
    assetName?: string;
    assetLink?: string;
    terms?: string;
}

export interface Balance {
    amount: number;
}
