import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost';
const token = localStorage.getItem('access_token') || '';

export const socketInstance = io(SOCKET_URL, {
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
});

socketInstance.on('newMessage', (message) => {
  console.log('Socket newMessage newMessagenewMessage:', message);
});
