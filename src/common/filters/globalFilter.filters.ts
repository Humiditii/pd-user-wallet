import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
@Injectable()
export class AllGlobalExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllGlobalExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = exception.message || 'Internal server error';

        if (exception?.response?.message) {
            if (Array.isArray(exception.response.message)) {
                message = exception.response.message.join(', ');
            } else {
                message = exception.response.message;
            }
        }

        // Log the error
        this.logger.error(
            `${request.method} ${request.url} ${status} - ${message}`,
            exception instanceof Error ? exception.stack : JSON.stringify(exception)
        );

        const errorResponse: any = {
            message: message,
            status: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(status).json(errorResponse);
    }
}
