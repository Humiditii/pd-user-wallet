import { Role } from "@common/interface/main.interface"

export interface UserI {
    id: string
    email: string
    role: Role
    createdAt: Date
}

export interface CreateUserResponseI {
    token: string;
    user: {
        id: string;
        email: string;
    }
}
