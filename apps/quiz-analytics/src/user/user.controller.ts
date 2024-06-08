import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guards/roles.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permission.decorator';
import { AuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
@UseGuards(AuthGuard, RoleGuard, PermissionGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  @Permissions('USER.ALL', 'USER.READ')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @Permissions('USER.ALL', 'USER.READ')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Permissions('USER.UPDATE')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('USER.ALL', 'USER.DELETE')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
