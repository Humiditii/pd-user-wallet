import { HttpException } from "@nestjs/common"
import { AppErr } from "./interface/main.interface";

export class AppException extends HttpException {
    constructor(message: string, status: number, state: boolean = false) {
        super({ message, state, statusCode: status }, status);
    }
}

export const AppResponse = {

    success: (message: string, statusCode: number, data: any = {}) => {

        return {
            message,
            status: true,
            statusCode,
            data
        }
    },
    error: (err: AppErr) => {
        const message = err?.message ? err.message : `internal server error @ ${err?.location}`;
        throw new AppException(message, err?.status ?? 500)
    }

}
