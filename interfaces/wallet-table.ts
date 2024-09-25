export interface Transaction {
    id: string;
    transactionDate: Date;
    transactionId: string;
    amount: number;
}

export interface Balance {
    amount: number;
}
