import { IsArray, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskAttachmentType } from '../taskAttachment.entity';

class AnswerMediaDto {
  @IsEnum(TaskAttachmentType)
  type: TaskAttachmentType;

  @IsString()
  url: string;

  @IsOptional()
  isCorrective?: boolean;
}

export class AnswerTaskDto {
  @IsOptional()
  @IsString()
  @Length(2, 2000)
  answer?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerMediaDto)
  media?: AnswerMediaDto[];
}

