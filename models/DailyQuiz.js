import mongoose from 'mongoose';

const DailyQuizSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Index for efficient date queries
DailyQuizSchema.index({ date: 1 });

export default mongoose.models.DailyQuiz || mongoose.model('DailyQuiz', DailyQuizSchema);

