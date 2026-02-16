export interface AppErr {
    readonly message: string
    readonly status: number
    readonly data?: object
    readonly location?: string
}

export interface JwtPayloadI {
    readonly userId: string
    readonly email: string
    readonly userRole: Role
}


export enum Role {
    Admin = 'admin',
    User = 'user'
}

export enum TransactionType {
    CREDIT = 'credit',
    WITHDRAW = 'withdraw'
}

export interface FetchPropI {
    readonly limit?: number
    readonly page?: number
    readonly fetchAll?: 'yes' | 'no'
}
