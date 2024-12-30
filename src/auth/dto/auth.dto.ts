import { IsString, IsEmail, IsNotEmpty, IsMobilePhone, IsEnum , IsOptional , Matches , Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(/@/, { message: 'Email must contain @ symbol' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}