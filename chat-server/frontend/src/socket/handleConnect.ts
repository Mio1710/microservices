import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost';
const token = localStorage.getItem('access_token') || '';
console.log('Check token: ', token);

const socketInstance = io(SOCKET_URL, {
  path: '/chat/socket.io',
  transports: ['websocket'],
  auth: { token },
  withCredentials: true
});

socketInstance.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});
socketInstance.on('connect', () => {
  console.log('Socket connected:', socketInstance.id);
});
socketInstance.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  socketInstance.emit('onDisconnect', token);
});

socketInstance.on('newMessage', (message) => {
  console.log('Socket newMessage newMessagenewMessage:', message);
});

export const getSocketInstance = () => {
  if (!socketInstance && token) {
    return io(SOCKET_URL, {
      path: '/chat/socket.io',
      transports: ['websocket'],
      auth: { token },
      withCredentials: true
    });
  }
  return socketInstance;
};
