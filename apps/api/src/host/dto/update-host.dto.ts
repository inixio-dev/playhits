import { ApiProperty } from "@nestjs/swagger";

export class UpdateHostDto {
    @ApiProperty({
        description: 'New password'
    })
    password: string;
}
