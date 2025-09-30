import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['text', 'meme', 'link'],
    default: 'text',
  },
  mediaUrl: String,
  linkUrl: String,
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['like', 'fire', 'crown', 'skull'],
    },
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    isAnonymous: Boolean,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
