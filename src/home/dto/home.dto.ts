import { IsString, IsOptional } from 'class-validator';

export class CreateHomeDto {
  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional() // Optional since it can be null
  heading?: string;

  @IsString()
  @IsOptional() // Optional since it can be null
  description?: string;

  @IsString()
  @IsOptional() // Optional since it can be null
  image?: string;

  @IsString()
  @IsOptional() // Optional since it can be null
  button?: string;

  @IsString()
  @IsOptional() // Optional since it can be null
  link?: string;
}
