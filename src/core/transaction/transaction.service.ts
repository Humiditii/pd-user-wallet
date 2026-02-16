import { Injectable, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionI } from './interface/transaction.interface';
import { TransactionType, FetchPropI } from '@common/interface/main.interface';
import { AppResponse } from '@common/appResponse.parser';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
    constructor(private readonly transactionRepository: TransactionRepository) { }

    async record(data: Omit<TransactionI, 'id' | 'createdAt'>) {
        return this.transactionRepository.create({
            id: uuidv4(),
            ...data,
            createdAt: new Date()
        });
    }

    async findByIdempotencyKey(userId: string, key: string) {
        return this.transactionRepository.findOne(t => t.userId === userId && t.idempotencyKey === key);
    }

    async getTransactions(userId: string, fetchProp: FetchPropI) {
        const { documents, count } = await this.transactionRepository.search(
            t => t.userId === userId,
            fetchProp,
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        return AppResponse.success('Transactions fetched successfully', HttpStatus.OK, {
            transactions: documents,
            count,
            page: fetchProp.page || 1,
            limit: fetchProp.limit || 10
        });
    }
}
