import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService {
  private channel: amqp.Channel;

  async connect() {
    const connection = await amqp.connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('chat_queue');
  }

  async sendMessage(message: string) {
    await this.channel.sendToQueue('chat_queue', Buffer.from(message));
  }

  async consumeMessages(callback: (message: string) => void) {
    await this.channel.consume('chat_queue', (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }
}