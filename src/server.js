const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

dotenv.config();
connectDB();

// Allow CORS for frontend dev
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Store online users in memory
const onlineUsers = new Map();

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Track which user connected
  socket.on('userConnected', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`✅ ${userId} is online`);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }
  });

  // Join conversation room
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

  // Message sending
  socket.on('sendMessage', ({ conversationId, message }) => {
    socket.to(conversationId).emit('receiveMessage', message);
  });

  // Disconnect
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

// Make `io` accessible in routes/controllers if needed
app.set('io', io);

server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
