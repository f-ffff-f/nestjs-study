import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

class SignInDto {
    username: string
    password: string
}
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        console.log(signInDto)
        return this.authService.signIn(signInDto.username, signInDto.password)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(
        @Request() req: Request & { user: { sub: number; username: string } }
    ) {
        return req.user
    }
}
