import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  name?: string;
}
