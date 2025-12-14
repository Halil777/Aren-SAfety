import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { Project } from '../projects/project.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateLocationDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
    const location = this.locationsRepository.create({
      ...dto,
      tenantId,
    });
    return this.locationsRepository.save(location);
  }

  findAllForTenant(tenantId: string) {
    return this.locationsRepository.find({
      where: { tenantId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateLocationDto) {
    const existing = await this.locationsRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Location not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      existing.projectId = dto.projectId;
    }

    if (dto.name !== undefined) {
      existing.name = dto.name;
    }

    return this.locationsRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.locationsRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Location not found');
    }

    await this.locationsRepository.remove(existing);
    return { success: true };
  }

  private async ensureProjectBelongsToTenant(projectId: string, tenantId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException('Project not found for tenant');
    }
  }
}
