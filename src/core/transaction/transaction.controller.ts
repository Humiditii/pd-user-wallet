import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@common/guard/auth.guard';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    async getTransactions(
        @Req() req: any,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.transactionService.getTransactions(req.user.userId, {
            page: Number(page),
            limit: Number(limit)
        });
    }
}
