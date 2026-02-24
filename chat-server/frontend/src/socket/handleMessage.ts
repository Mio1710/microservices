import { SendMessage } from '@/components/Chat/types';
import { Socket } from 'socket.io-client';

export const onSendMessage = (socket: Socket, data: SendMessage) => {
  console.log('send message: ', data);
  socket.emit('sendMessage', data);
};
