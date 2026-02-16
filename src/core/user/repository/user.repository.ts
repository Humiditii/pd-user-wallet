import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/baseRepository.repository';
import { UserI } from '../interface/user.interface';

@Injectable()
export class UserRepository extends BaseRepository<UserI> {

}
