import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
//import * as socketio_jwt from 'socketio-jwt';
import { Server, Socket } from 'socket.io';

import { CreateNotificationDto } from './DTO/create-notification.dto';

import { ConfigurationService } from 'src/configuration/configuration.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notification',
  secure: true,
})
export class NotificationSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private configurationService: ConfigurationService) {}
  afterInit() {
    //console.log('Init');
  }

  /*afterInit(): void {
    this.server.use(
      socketio_jwt.authorize({
        secret: this.config_service.get<string>('JWT_SECRET'),
        handshake: true,
      }),
    );
  }*/

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  public async handleCreateNotification(
    createNotificationDto: CreateNotificationDto,
  ) {
    try {
      this.server
        .to(`roomId${createNotificationDto.notifierId}`)
        .emit('CREATED_NOTIFICATION', createNotificationDto);
      console.log(
        `Created notification to ${createNotificationDto.notifierId}`,
      );
    } catch (e) {
      console.error(e.stack);
    }
  }

  @SubscribeMessage('JOIN_CONVERSATION')
  public handleJoinConversation(client: Socket, userId: any) {
    const userIdNumber = userId.userId;
    const roomId = `roomId${userIdNumber}`;
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('LEAVE_CONVERSATION')
  public handleLeaveConversation(client: Socket, userId: any) {
    const userIdNumber = userId.userId;
    const roomId = `roomId${userIdNumber}`;
    client.leave(roomId);
  }
}
