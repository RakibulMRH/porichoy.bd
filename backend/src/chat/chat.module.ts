import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller'; // Import the ChatController
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService],
  controllers: [ChatController], // Include the ChatController
  exports: [ChatService],
})
export class ChatModule {}