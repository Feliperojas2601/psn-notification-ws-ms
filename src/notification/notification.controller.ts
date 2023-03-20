import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateNotificationDto } from './DTO/create-notification.dto';
import { NotificationSocketGateway } from './notification.gateway';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationSocketGateway,
  ) {}

  @MessagePattern('CREATE_NOTIFICATION')
  async handleCreateNotification(
    @Ctx() context: RmqContext,
    @Payload() createNotificationDto: CreateNotificationDto,
  ) {
    console.log('Received message:', createNotificationDto);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.notificationGateway.handleCreateNotification(
        createNotificationDto,
      );
      console.log('Successfully handled message:', createNotificationDto);
      await channel.ack(originalMsg);
      console.log('Successfully handled ack');
    } catch (error) {
      console.error('Error handling message:', error);
      await channel.nack(originalMsg);
      console.log('Successfully handled nack');
    }
  }
}
