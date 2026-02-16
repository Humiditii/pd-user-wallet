import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/user.dto';
import { Role } from '@common/interface/main.interface';
import { WalletService } from '@core/wallet/wallet.service';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserResponseI } from './interface/user.interface';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly walletService: WalletService
    ) { }

    async createUser(dto: CreateUserDto): Promise<CreateUserResponseI> {
        let user = await this.userRepository.findOne(u => u.email === dto.email);

        if (!user) {
            user = await this.userRepository.create({
                id: uuidv4(),
                email: dto.email,
                role: Role.User,
                createdAt: new Date()
            });

            await this.walletService.initializeWallet(user.id, 10000);
        }

        const payload = {
            userId: user.id,
            email: user.email,
            userRole: user.role
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
}
