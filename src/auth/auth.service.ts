import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SigninDto,SignupDto } from './dto/auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: DatabaseService, private jwtService: JwtService) {}

  async signup(signupDto: SignupDto) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      // Create the user in the database
      const user = await this.prisma.user.create({
        data: {
          name: signupDto.name,  // Assuming you have 'name' in the DTO
          email: signupDto.email,
          password: hashedPassword,
        },
      });

      // Return a user object with id and email
      return { id: user.id, email: user.email , message: 'User registered successfully', };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: signinDto.email },
      });

      if (!user) {
        throw new BadRequestException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      // Create JWT payload
      const payload = { email: user.email, id: user.id ,name : user.name};
      return {
        ...payload,
        access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        message : "user loggedIn successfully"
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      throw new InternalServerErrorException('Failed to sign in');
    }
  }
}
