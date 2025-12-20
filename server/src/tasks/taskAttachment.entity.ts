import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';

export enum TaskAttachmentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

@Entity('task_attachments')
export class TaskAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, task => task.media, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @Column({ type: 'enum', enum: TaskAttachmentType, enumName: 'task_attachment_type_enum' })
  type: TaskAttachmentType;

  @Column()
  url: string;

  @Column()
  uploadedByUserId: string;

  @ManyToOne(() => MobileAccount, {
    onDelete: 'CASCADE',
  })
  uploadedBy: MobileAccount;

  @Column({ default: false })
  isCorrective: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

