import { IsNotEmpty, IsPositive } from "class-validator";

export class CreateWithdrawalDto {
    @IsPositive()
    @IsNotEmpty()
    amount: number
}
