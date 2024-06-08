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
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserReq } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }

  @Post(':quizId/start')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  startQuiz(@Param('quizId') quizId: string, @UserReq() user: User) {
    return this.quizService.startQuiz(quizId, user.id);
  }

  @Post(':quizId/end')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  endQuiz(@Param('quizId') quizId: string, @UserReq() user: User) {
    return this.quizService.endQuiz(quizId, user.id);
  }

  @Get(':quizId/result')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getQuizResult(@Param('quizId') quizId: string, @UserReq() user: User) {
    return this.quizService.getQuizResult(quizId, user.id);
  }

  @Get('/results')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getResults(@UserReq() user: User) {
    return this.quizService.getResults(user.id);
  }

  @Get('/leaderboard/:quizId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getLeaderboard(@Param('quizId') quizId: string) {
    return this.quizService.getLeaderboard(quizId);
  }
}
