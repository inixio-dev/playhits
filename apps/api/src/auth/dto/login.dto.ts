import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: 'bardemo'
    })
    username: string;

    @ApiProperty({
        example: 'Admin1234'
    })
    password: string;
}