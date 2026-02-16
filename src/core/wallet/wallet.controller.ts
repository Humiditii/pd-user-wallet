import { Controller, Get, Post, Body, UseGuards, Req, HttpStatus, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@common/guard/auth.guard';
import { IdempotencyGuard } from '@common/guard/idempotency.guard';
import { UpdateBalanceDto } from './dto/wallet.dto';
import { Response } from 'express';
import { AppResponse } from '@common/appResponse.parser';

@Controller()
@UseGuards(AuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    private success = AppResponse.success;

    @Get('balance')
    async getBalance(@Res() res: Response, @Req() req: any): Promise<Response> {

        const data = await this.walletService.getBalance(req.user.userId);

        return res.status(HttpStatus.OK).json(this.success('Balance fetched successfully', HttpStatus.OK, data));

    }

    @Post('add_balance')
    @UseGuards(IdempotencyGuard)
    async addBalance(@Res() res: Response, @Req() req: any, @Body() dto: UpdateBalanceDto): Promise<Response> {

        const idempotencyKey = req.headers['idempotency-key'] as string;

        const data = await this.walletService.addBalance(req.user.userId, dto.amount, idempotencyKey);

        const message = data.isIdempotent ? 'Balance added successfully (idempotent)' : 'Balance added successfully';

        return res.status(HttpStatus.OK).json(this.success(message, HttpStatus.OK, { balance: data.balance }));
    }

    @Post('withdraw')
    @UseGuards(IdempotencyGuard)
    async withdraw(@Res() res: Response, @Req() req: any, @Body() dto: UpdateBalanceDto): Promise<Response> {

        const idempotencyKey = req.headers['idempotency-key'] as string;

        const data = await this.walletService.withdraw(req.user.userId, dto.amount, idempotencyKey);

        const message = data.isIdempotent ? 'Withdrawal successful (idempotent)' : 'Withdrawal successful';

        return res.status(HttpStatus.OK).json(this.success(message, HttpStatus.OK, { balance: data.balance }));
    }
}
