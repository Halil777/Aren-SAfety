import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MobileAccountsService } from './mobile-accounts.service';
import { CreateMobileAccountDto } from './dto/create-mobile-account.dto';
import { UpdateMobileAccountDto } from './dto/update-mobile-account.dto';
import { MobileRole } from './mobile-role';

@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class MobileAccountsController {
  constructor(private readonly accountsService: MobileAccountsService) {}

  @Post('supervisors')
  createSupervisor(@Req() req: any, @Body() dto: CreateMobileAccountDto) {
    return this.accountsService.create(req.user.userId, {
      ...dto,
      role: MobileRole.SUPERVISOR,
    });
  }

  @Get('supervisors')
  listSupervisors(@Req() req: any) {
    return this.accountsService.findAll(req.user.userId, MobileRole.SUPERVISOR);
  }

  @Patch('supervisors/:id')
  updateSupervisor(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMobileAccountDto,
  ) {
    return this.accountsService.update(req.user.userId, id, {
      ...dto,
      role: MobileRole.SUPERVISOR,
    });
  }

  @Delete('supervisors/:id')
  removeSupervisor(@Req() req: any, @Param('id') id: string) {
    return this.accountsService.remove(req.user.userId, id, MobileRole.SUPERVISOR);
  }
}
