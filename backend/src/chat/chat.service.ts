import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createMessage(customerId: string, adminId: string, message: string) {
    const newMessage = this.chatRepository.create({
      customerId,
      adminId,
      message,
      timestamp: new Date(),
    });
    return this.chatRepository.save(newMessage);
  }

  async getAllMessages() {
    return this.chatRepository.find();
  }

  async blockCustomer(customerId: string) {
    return this.chatRepository.update(
      { customerId },
      { blocked: true },
    );
  }
}