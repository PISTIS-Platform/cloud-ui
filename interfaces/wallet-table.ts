export interface Transaction {
    id: string;
    transactionDate: Date;
    transactionId: string;
    amount: number;
    type: string;
}

export interface Balance {
    amount: number;
}
