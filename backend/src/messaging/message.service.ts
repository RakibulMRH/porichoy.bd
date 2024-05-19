//messaging services.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(userId: number, message: string): Promise<Message> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Invalid user');
    }

    const newMessage = new Message();
    newMessage.message = message;
    newMessage.user = user;

    return this.messageRepository.save(newMessage);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { user: { id: userId } } });
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['user'] });
  }
}