import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: String,
  image: String,
  link: String,
  category: {
    type: String,
    enum: ['release', 'drama', 'tour', 'interview', 'general'],
    default: 'general',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.models.News || mongoose.model('News', NewsSchema);
