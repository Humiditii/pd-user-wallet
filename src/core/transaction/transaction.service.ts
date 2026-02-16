import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionI, GetTransactionsResponseI } from './interface/transaction.interface';
import { FetchPropI } from '@common/interface/main.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
    constructor(private readonly transactionRepository: TransactionRepository) { }

    async record(data: Omit<TransactionI, 'id' | 'createdAt'>): Promise<TransactionI> {
        return this.transactionRepository.create({
            id: uuidv4(),
            ...data,
            createdAt: new Date()
        });
    }

    async findByIdempotencyKey(userId: string, key: string): Promise<TransactionI | null> {
        return this.transactionRepository.findOne(t => t.userId === userId && t.idempotencyKey === key);
    }

    async getTransactions(userId: string, fetchProp: FetchPropI): Promise<GetTransactionsResponseI> {
        const { documents, count } = await this.transactionRepository.search(
            t => t.userId === userId,
            fetchProp,
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        return {
            transactions: documents,
            count,
            page: fetchProp.page || 1,
            limit: fetchProp.limit || 10
        };
    }
}
