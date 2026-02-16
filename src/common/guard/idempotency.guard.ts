import {
    CanActivate,
    ExecutionContext,
    Injectable,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class IdempotencyGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['idempotency-key'];

        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required for this operation');
        }

        return true;
    }
}
