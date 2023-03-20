import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { NotificationSocketGateway } from './notification.gateway';
import { ConfigurationService } from 'src/configuration/configuration.service';

import { NotificationController } from './notification.controller';

@Module({
  imports: [ConfigurationModule],
  controllers: [NotificationController],
  providers: [
    NotificationSocketGateway,
    {
      provide: 'NOTIFICATION_RMQ_SERVICE',
      useFactory: (configurationService: ConfigurationService) => {
        const user = configurationService.get('RABBITMQ_USER');
        const password = configurationService.get('RABBITMQ_PASSWORD');
        const host = configurationService.get('RABBITMQ_HOST');
        const queueName = configurationService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigurationService],
    },
  ],
})
export class NotificationModule {}
