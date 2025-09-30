import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'true_false', 'short_answer', 'audio_mcq'],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
  }],
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string or array of strings
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [{
    type: String,
  }],
  source: String,
  explanation: String, // Explanation for the correct answer
  isBonus: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);

