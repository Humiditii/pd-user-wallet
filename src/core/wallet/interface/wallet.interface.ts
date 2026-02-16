export interface WalletI {
    id: string
    userId: string
    balance: number
    updatedAt: Date
}

export interface BalanceResponseI {
    balance: number;
}

export interface MutationResponseI {
    balance: number;
    isIdempotent?: boolean;
}
