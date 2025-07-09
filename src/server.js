const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

dotenv.config();
connectDB();

const server = http.createServer(app);

// CORS setup (adjust in production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with actual frontend domain
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // User login/register to socket
  socket.on('userConnected', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`✅ ${userId} is now online`);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }
  });

  // ======= 💬 Chat Events =======
  socket.on('join', (conversationId) => {
    socket.join(conversationId);
    console.log(`👥 Joined chat room: ${conversationId}`);
  });

  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { userId });
  });

  socket.on('stopTyping', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('stopTyping', { userId });
  });

  socket.on('sendMessage', ({ conversationId, message }) => {
    socket.to(conversationId).emit('receiveMessage', message);
    io.emit('refreshConversations');
  });

  // ======= 📞 Voice Call Events =======
  socket.on('startCall', ({ from, to, signal }) => {
    const recipientSocketId = onlineUsers.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('incomingCall', {
        from,
        signal,
      });
      console.log(`📞 Call from ${from} → ${to}`);
    } else {
      console.log(`⚠️ ${to} is not online`);
    }
  });

  socket.on('answerCall', ({ to, signal }) => {
    const callerSocketId = onlineUsers.get(to);
    if (callerSocketId) {
      io.to(callerSocketId).emit('callAccepted', { signal });
      console.log(`✅ Call accepted by ${to}`);
    }
  });

  socket.on('endCall', ({ to }) => {
    const recipientSocketId = onlineUsers.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('callEnded');
      console.log(`🔚 Call ended with ${to}`);
    }
  });

  // ======= 🔌 Disconnection =======
  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});


// ✅ Serve Vite/React frontend
const frontendPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 🔥 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
