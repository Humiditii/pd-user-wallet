import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/user.dto';
import { AppResponse } from '@common/appResponse.parser';
import { Role } from '@common/interface/main.interface';
import { WalletService } from '@core/wallet/wallet.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly walletService: WalletService
    ) { }

    async createUser(dto: CreateUserDto) {
        try {
            let user = await this.userRepository.findOne(u => u.email === dto.email);

            if (user) {
                // If user exists, we'll just return token for simplicity in this assessment
                // or we could throw error. PDF says "POST /user returns a JWT token".
                // Usually it means registration, but let's handle both.
            } else {
                user = await this.userRepository.create({
                    id: uuidv4(),
                    email: dto.email,
                    role: Role.User,
                    createdAt: new Date()
                });

                await this.walletService.initializeWallet(user.id, 10000);
            }

            const payload = { userId: user.id, email: user.email, userRole: user.role };
            const token = await this.jwtService.signAsync(payload);

            return AppResponse.success('User created/logged in successfully', HttpStatus.CREATED, {
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        } catch (error) {
            return AppResponse.error({
                message: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                location: 'UserService.createUser'
            });
        }
    }
}
