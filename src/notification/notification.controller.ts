import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { CreateNotificationDto } from './DTO/create-notification.dto';
import { NotificationSocketGateway } from './notification.gateway';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationSocketGateway,
  ) {}

  @MessagePattern('CREATE_NOTIFICATION', Transport.RMQ)
  async handleCreateNotification2(
    @Payload() createNotificationDto: CreateNotificationDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.notificationGateway.handleCreateNotification(
        createNotificationDto,
      );
      await channel.ack(originalMsg);
      console.log('Successfully handled ack');
    } catch (error) {
      await channel.nack(originalMsg);
      console.log('Successfully handled nack');
    }
  }
}
