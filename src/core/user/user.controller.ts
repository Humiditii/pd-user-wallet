import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Public } from '@common/decorator/public.decorator';
import { Response } from 'express';
import { AppResponse } from '@common/appResponse.parser';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    private success = AppResponse.success;

    @Public()
    @Post()
    async createUser(@Res() res: Response, @Body() dto: CreateUserDto): Promise<Response> {

        const data = await this.userService.createUser(dto);

        return res.status(HttpStatus.CREATED).json(this.success('User logged in successfully', HttpStatus.OK, data));

    }
}
