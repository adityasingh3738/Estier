import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dailyQuiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyQuiz',
    required: true,
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    points: Number,
    timeSpent: Number, // in seconds
  }],
  score: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  isPerfect: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Compound index to ensure one attempt per user per daily quiz
QuizAttemptSchema.index({ user: 1, dailyQuiz: 1 }, { unique: true });
QuizAttemptSchema.index({ score: -1 }); // For leaderboards

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

