import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/baseRepository.repository';
import { TransactionI } from '../interface/transaction.interface';

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionI> {

}
