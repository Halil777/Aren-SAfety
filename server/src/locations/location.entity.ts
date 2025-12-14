import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { Tenant } from '../tenants/tenant.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.locations, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.projects, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
