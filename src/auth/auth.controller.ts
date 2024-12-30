import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto ,SigninDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  // Endpoint for user signin
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  

}
