import { IsString, IsOptional } from 'class-validator';

export class UpdateHealthCareProviderDto {
  @IsString()
  @IsOptional()
  sectionName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
