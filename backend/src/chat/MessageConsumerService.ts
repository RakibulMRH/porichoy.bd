import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '../chat/rabbitmq.service';

@Injectable()
export class MessageConsumerService {
  constructor(private readonly rabbitmqService: RabbitmqService) {
    this.consumeMessages();
  }

  private async consumeMessages() {
    await this.rabbitmqService.consumeMessages((message) => {
      console.log(`Received message: ${message}`);
      // Handle the received message
    });
  }
}