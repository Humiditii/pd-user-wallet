import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/baseRepository.repository';
import { WalletI } from '../interface/wallet.interface';

@Injectable()
export class WalletRepository extends BaseRepository<WalletI> {

}
