import { Controller, Get, Post, Body, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@common/guard/auth.guard';
import { IdempotencyGuard } from '@common/guard/idempotency.guard';
import { UpdateBalanceDto } from './dto/wallet.dto';

@Controller()
@UseGuards(AuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('balance')
    async getBalance(@Req() req: any) {
        return this.walletService.getBalance(req.user.userId);
    }

    @Post('add_balance')
    @UseGuards(IdempotencyGuard)
    async addBalance(@Req() req: any, @Body() dto: UpdateBalanceDto) {
        const idempotencyKey = req.headers['idempotency-key'];
        return this.walletService.addBalance(req.user.userId, dto.amount, idempotencyKey);
    }

    @Post('withdraw')
    @UseGuards(IdempotencyGuard)
    async withdraw(@Req() req: any, @Body() dto: UpdateBalanceDto) {
        const idempotencyKey = req.headers['idempotency-key'];
        return this.walletService.withdraw(req.user.userId, dto.amount, idempotencyKey);
    }
}
