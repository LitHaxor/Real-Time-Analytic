import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/jwtAuth.guard';
import { UserReq } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Quiz Responses')
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post('/answer')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Body() createResponseDto: CreateResponseDto, @UserReq() user: User) {
    return this.responsesService.create(createResponseDto, user.id);
  }

  @Get()
  findAll() {
    return this.responsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responsesService.update(id, updateResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsesService.remove(id);
  }
}
