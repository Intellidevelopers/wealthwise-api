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

// CORS setup (adjust `origin` in production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // ✅ Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// ✅ Store Socket.IO reference globally
app.set('io', io);

// 🟢 Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Track connected users
  socket.on('userConnected', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(userId); // for targeted emits
      console.log(`✅ ${userId} is online`);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }
  });

  // Join chat room
  socket.on('join', (conversationId) => {
    socket.join(conversationId);
    console.log(`👥 User joined room: ${conversationId}`);
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { userId });
  });

  socket.on('stopTyping', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('stopTyping', { userId });
  });

  // Handle message
  socket.on('sendMessage', ({ conversationId, message }) => {
    socket.to(conversationId).emit('receiveMessage', message);
    io.emit('refreshConversations'); // 🔄 trigger refresh on all clients
  });

  // On disconnect
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});


// ✅ Serve frontend from Vite (React) build
const frontendPath = path.join(__dirname, 'client', 'dist'); // Adjust if your dist path is different
app.use(express.static(frontendPath));

// ✅ React Router fallback: serve index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 🔥 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
