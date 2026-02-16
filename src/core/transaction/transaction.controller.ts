import { Controller, Get, Query, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@common/guard/auth.guard';
import { Response } from 'express';
import { AppResponse } from '@common/appResponse.parser';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    private success = AppResponse.success;

    @Get()
    async getTransactions(
        @Res() res: Response,
        @Req() req: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ): Promise<Response> {

        const data = await this.transactionService.getTransactions(req.user.userId, {
            page: Number(page),
            limit: Number(limit)
        });

        return res.status(HttpStatus.OK).json(this.success('Transactions fetched successfully', HttpStatus.OK, data));
    }
}
