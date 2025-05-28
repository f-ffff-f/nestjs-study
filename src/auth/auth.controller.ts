import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common'
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
        console.log('signInDto', signInDto)
        return this.authService.signIn(signInDto.username, signInDto.password)
    }
}
