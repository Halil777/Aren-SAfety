import { IsBoolean, IsEnum, IsString, IsUUID } from 'class-validator';
import { TaskAttachmentType } from '../taskAttachment.entity';

export class CreateTaskMediaDto {
  @IsEnum(TaskAttachmentType)
  type: TaskAttachmentType;

  @IsString()
  url: string;

  @IsUUID()
  uploadedByUserId: string;

  @IsBoolean()
  isCorrective: boolean;
}

