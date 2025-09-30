import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  songs: [{
    title: String,
    artist: String,
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
}, { timestamps: true });

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);
