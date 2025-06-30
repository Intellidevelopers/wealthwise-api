const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');

exports.createOrGetConversation = async (req, res) => {
  const { userId } = req.body;

  // ❗ Validate
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  if (userId === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot create conversation with yourself' });
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, userId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, userId],
    });
  }

  res.json(conversation);
};


exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'firstName lastName avatar')
      .sort({ updatedAt: -1 });

    const filtered = conversations.map((conv) => {
      const participant = conv.participants.find(
        (p) => p._id.toString() !== req.user._id.toString()
      );

      return {
        _id: conv._id,
        participant, // ✅ simplified for frontend
        updatedAt: conv.updatedAt,
      };
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};


// controllers/message.controller.js
exports.getMessages = async (req, res) => {
  const messages = await Message.find({ conversation: req.params.id })
    .populate('sender', 'firstName lastName avatar')
    .sort({ createdAt: 1 });

  // Mark messages as read (only the ones not sent by current user)
  await Message.updateMany(
    { conversation: req.params.id, receiver: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json(messages);
};

// Add to controllers/message.controller.js
exports.getUnreadCounts = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id });

  const counts = await Promise.all(
    conversations.map(async (conv) => {
      const count = await Message.countDocuments({
        conversation: conv._id,
        receiver: req.user._id,
        isRead: false,
      });
      return { conversationId: conv._id, count };
    })
  );

  res.json(counts);
};


exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const conversationId = req.params.id;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // 1. Find conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // 2. Identify receiver (the other participant)
    const receiverId = conversation.participants.find(
      (id) => id.toString() !== req.user._id.toString()
    );

    // 3. Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    // 4. Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    // 5. Populate both sender and receiver (important for frontend rendering)
    const populated = await Message.findById(message._id)
      .populate('sender', '_id firstName lastName avatar')
      .populate('receiver', '_id firstName lastName avatar');

    // 6. Return the fully populated message
    res.status(201).json(populated);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// controllers/message.controller.js
exports.getRecentUnreadMessages = async (req, res) => {
  const messages = await Message.find({
    receiver: req.user._id,
    isRead: false,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('sender', 'firstName lastName avatar');

  res.json(messages);
};
