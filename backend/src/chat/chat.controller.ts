import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RabbitmqService } from './rabbitmq.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Post('send')
  async sendMessage(
    @Body('customerId') customerId: string,
    @Body('adminId') adminId: string,
    @Body('message') message: string,
  ) {
    const newMessage = await this.chatService.createMessage(
      customerId,
      adminId,
      message,
    );
    this.rabbitmqService.sendMessage(JSON.stringify(newMessage));
    return newMessage;
  }

  @Get('messages')
  async getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Post('block/:customerId')
  async blockCustomer(@Param('customerId') customerId: string) {
    await this.chatService.blockCustomer(customerId);
    return { message: 'Customer blocked' };
  }
}