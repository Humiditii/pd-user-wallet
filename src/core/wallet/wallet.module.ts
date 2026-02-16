import { Module, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from './repository/wallet.repository';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TransactionModule,
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [WalletController],
    providers: [WalletService, WalletRepository],
    exports: [WalletService, WalletRepository],
})
export class WalletModule { }
