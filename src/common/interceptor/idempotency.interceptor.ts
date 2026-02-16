import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * A simple in-memory cache for idempotency.
 * In a real app, this should be in Redis with an expiry.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    private responses = new Map<string, { body: any, status: number }>();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const key = request.headers['idempotency-key'];
        const userId = request.user?.userId || 'anonymous';
        const cacheKey = `${userId}:${key}:${request.method}:${request.url}`;

        if (this.responses.has(cacheKey)) {
            const cached = this.responses.get(cacheKey);
            if (cached) {
                response.status(cached.status);
                return of(cached.body);
            }
        }

        return next.handle();
    }
}
