import { IsString, IsOptional } from 'class-validator';

export class CreateHealthCareProviderDto {
  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional()
  description?: string;
}
