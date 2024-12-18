import { IsInt, IsString, MaxLength, Min } from "class-validator"

export class CreateUserDto {
    
    @IsString()
    @MaxLength(25)
    name : string

    @IsString()
    @MaxLength(25)
    lastname : string

    @IsInt()
    @Min(1)
    age : number
}
