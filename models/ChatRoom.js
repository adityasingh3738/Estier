import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  trackId: String,
  type: {
    type: String,
    enum: ['global', 'track', 'event'],
    default: 'global',
  },
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
    content: String,
    isAnonymous: Boolean,
    reactions: [{
      type: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);
