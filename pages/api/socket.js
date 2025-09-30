import { Server } from 'socket.io';
import dbConnect from '../../lib/mongodb';
import ChatRoom from '../../models/ChatRoom';

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  await dbConnect();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      try {
        const room = await ChatRoom.findById(roomId);
        if (room) {
          socket.emit('room-messages', room.messages);
        }
      } catch (error) {
        console.error('Error fetching room messages:', error);
      }
    });

    socket.on('send-message', async (data) => {
      const { roomId, message, userId, username, isAnonymous } = data;

      try {
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          return socket.emit('error', 'Room not found');
        }

        const newMessage = {
          user: userId,
          username: isAnonymous ? 'Anonymous' : username,
          content: message,
          isAnonymous,
          reactions: [],
          createdAt: new Date(),
        };

        room.messages.push(newMessage);
        await room.save();

        io.to(roomId).emit('new-message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
