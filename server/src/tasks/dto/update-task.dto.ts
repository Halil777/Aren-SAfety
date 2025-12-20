import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../task-status';
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  supervisorSeenAt?: string;

  @IsOptional()
  @IsDateString()
  fixedAt?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2000)
  rejectionReason?: string | null;
}

