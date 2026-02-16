import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { WalletRepository } from './repository/wallet.repository';
import { WalletI } from './interface/wallet.interface';
import { TransactionService } from '../transaction/transaction.service';
import { AppResponse } from '@common/appResponse.parser';
import { TransactionType } from '@common/interface/main.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
    // Simple in-memory mutex to handle concurrency per user
    private locks = new Map<string, Promise<void>>();

    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly transactionService: TransactionService
    ) { }

    private async acquireLock(userId: string): Promise<() => void> {
        while (this.locks.has(userId)) {
            await this.locks.get(userId);
        }

        let release: () => void;
        const lock = new Promise<void>((resolve) => {
            release = () => {
                this.locks.delete(userId);
                resolve();
            };
        });

        this.locks.set(userId, lock);
        return release!;
    }

    async initializeWallet(userId: string, balance: number) {
        const wallet = await this.walletRepository.create({
            id: uuidv4(),
            userId,
            balance,
            updatedAt: new Date()
        });

        // Record initial balance in ledger
        await this.transactionService.record({
            userId,
            amount: balance,
            type: TransactionType.CREDIT,
            reference: 'Initial Balance Registration',
        });

        return wallet;
    }

    async getBalance(userId: string) {
        const wallet = await this.walletRepository.findOne(w => w.userId === userId);
        if (!wallet) {
            return AppResponse.error({
                message: 'Wallet not found',
                status: HttpStatus.NOT_FOUND,
                location: 'WalletService.getBalance'
            });
        }

        return AppResponse.success('Balance fetched successfully', HttpStatus.OK, {
            balance: wallet.balance
        });
    }

    async addBalance(userId: string, amount: number, idempotencyKey: string) {
        const release = await this.acquireLock(userId);
        try {
            // Idempotency check
            const existing = await this.transactionService.findByIdempotencyKey(userId, idempotencyKey);
            if (existing) {
                const wallet = await this.walletRepository.findOne(w => w.userId === userId);
                return AppResponse.success('Balance added successfully (idempotent)', HttpStatus.OK, {
                    balance: wallet?.balance
                });
            }

            const wallet = await this.walletRepository.findOne(w => w.userId === userId);
            if (!wallet) throw new Error('Wallet not found');

            const newBalance = wallet.balance + amount;
            await this.walletRepository.update(wallet.id, {
                balance: newBalance,
                updatedAt: new Date()
            });

            // Double-entry record
            await this.transactionService.record({
                userId,
                amount,
                type: TransactionType.CREDIT,
                reference: `Balance add: ${amount}`,
                idempotencyKey
            });

            return AppResponse.success('Balance added successfully', HttpStatus.OK, {
                balance: newBalance
            });
        } finally {
            release();
        }
    }

    async withdraw(userId: string, amount: number, idempotencyKey: string) {
        const release = await this.acquireLock(userId);
        try {
            // Idempotency check
            const existing = await this.transactionService.findByIdempotencyKey(userId, idempotencyKey);
            if (existing) {
                const wallet = await this.walletRepository.findOne(w => w.userId === userId);
                return AppResponse.success('Withdrawal successful (idempotent)', HttpStatus.OK, {
                    balance: wallet?.balance
                });
            }

            const wallet = await this.walletRepository.findOne(w => w.userId === userId);
            if (!wallet) throw new Error('Wallet not found');

            if (wallet.balance < amount) {
                throw new BadRequestException('Insufficient balance');
            }

            const newBalance = wallet.balance - amount;
            await this.walletRepository.update(wallet.id, {
                balance: newBalance,
                updatedAt: new Date()
            });

            // Double-entry record
            await this.transactionService.record({
                userId,
                amount,
                type: TransactionType.WITHDRAW,
                reference: `Withdrawal: ${amount}`,
                idempotencyKey
            });

            return AppResponse.success('Withdrawal successful', HttpStatus.OK, {
                balance: newBalance
            });
        } finally {
            release();
        }
    }
}
