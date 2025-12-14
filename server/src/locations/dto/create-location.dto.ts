import { IsString, IsUUID, Length } from 'class-validator';

export class CreateLocationDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  name: string;
}
