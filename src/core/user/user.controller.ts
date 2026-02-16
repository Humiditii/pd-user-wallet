import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Public } from '@common/decorator/public.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Public()
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
}
