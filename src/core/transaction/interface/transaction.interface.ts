import { TransactionType } from "@common/interface/main.interface"

export interface TransactionI {
    id: string
    userId: string
    type: TransactionType
    amount: number
    reference: string
    createdAt: Date
    idempotencyKey?: string // To track idempotent requests
}

export interface GetTransactionsResponseI {
    transactions: TransactionI[];
    count: number;
    page: number;
    limit: number;
}
