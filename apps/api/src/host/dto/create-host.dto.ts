import { ApiProperty } from "@nestjs/swagger";

export class CreateHostDto {
    @ApiProperty({
        example: 'Bar de Prueba'
    })
    name: string;

    @ApiProperty({
        example: 'bardeprueba'
    })
    username: string;

    @ApiProperty({
        example: '*****'
    })
    password: string;
}
