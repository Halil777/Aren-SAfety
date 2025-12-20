import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MobileRole } from '../mobile-accounts/mobile-role';
import { AnswerTaskDto } from './dto/answer-task.dto';

@UseGuards(AuthGuard('mobile-jwt'))
@Controller('api/mobile/tasks')
export class MobileTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(@Req() req: any) {
    return this.tasksService.findForMobile(req.user.mobileAccountId, req.user.role);
  }

  @Get(':id')
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.findOneForMobile(req.user.mobileAccountId, req.user.role, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    if (req.user.role !== MobileRole.SUPERVISOR) {
      throw new ForbiddenException('Only supervisors can create tasks');
    }
    return this.tasksService.create(req.user.tenantId, req.user.mobileAccountId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateStatus(
      req.user.tenantId,
      req.user.mobileAccountId,
      req.user.role,
      id,
      dto,
    );
  }

  @Post(':id/answer')
  answer(@Req() req: any, @Param('id') id: string, @Body() dto: AnswerTaskDto) {
    return this.tasksService.answerTask(
      req.user.tenantId,
      req.user.mobileAccountId,
      req.user.role,
      id,
      dto,
    );
  }
}

