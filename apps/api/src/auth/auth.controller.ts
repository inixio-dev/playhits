import { Body, Controller, Get, Post, UseGuards, Request, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginInfo: LoginDto) {
        return this.authService.login(loginInfo);
    }

    @Post('spotify-token')
    @UseGuards(JwtAuthGuard)
    async saveSpotifyToken(@Req() request: any, @Body('code') code: string) {
        return this.authService.saveSpotifyToken(code, request.user.id);
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getMyData(@Request() req) {
        return this.authService.getMyData(req);
    }

}
