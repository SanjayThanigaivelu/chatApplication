import Message from '../models/Message.js';

export const socketHandler = (socket, io) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (chatId) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ chatId, sender, content, parentMessageId }) => {
    const newMessage = new Message({ chatId, sender, content, parentMessageId });
    await newMessage.save();
    io.to(chatId).emit('newMessage', newMessage);
  });

  socket.on('typing', ({ chatId, username }) => {
    socket.to(chatId).emit('typing', { username });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
};
