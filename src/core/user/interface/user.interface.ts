import { Role } from "@common/interface/main.interface"

export interface UserI {
    id: string
    email: string
    role: Role
    createdAt: Date
}
