import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User, UserDecorator } from '../users/entities/user.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @Body('message') message: string,
    @UserDecorator() user: User,
  ) {
    return this.messageService.createMessage(user.id, message);
  }

  @Get(':userId')
  async getMessagesByUser(@Param('userId') userId: number) {
    return this.messageService.getMessagesByUser(userId);
  }

  @Get()
  async getAllMessages() {
    return this.messageService.getAllMessages();
  }
}