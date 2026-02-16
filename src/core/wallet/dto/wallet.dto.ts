import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class UpdateBalanceDto {
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    amount: number;
}
