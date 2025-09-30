import dbConnect from '../../../lib/mongodb';
import DailyQuiz from '../../../models/DailyQuiz';
import Question from '../../../models/Question';
import QuizAttempt from '../../../models/QuizAttempt';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const userId = getUserFromRequest(req);
    
    // Get today's date at 00:00 UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Check if today's quiz already exists
    let dailyQuiz = await DailyQuiz.findOne({ date: today }).populate('questions');

    if (!dailyQuiz) {
      // Create new daily quiz with 5 random questions
      const allQuestions = await Question.find({ isActive: true });
      
      if (allQuestions.length < 5) {
        return res.status(500).json({ message: 'Not enough questions in bank' });
      }

      // Randomly select 5 questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 5);

      dailyQuiz = await DailyQuiz.create({
        date: today,
        questions: selectedQuestions.map(q => q._id),
        expiresAt: tomorrow,
      });

      dailyQuiz = await DailyQuiz.findById(dailyQuiz._id).populate('questions');
    }

    // Check if user has already completed today's quiz
    let hasCompleted = false;
    if (userId) {
      const attempt = await QuizAttempt.findOne({
        user: userId,
        dailyQuiz: dailyQuiz._id,
      });
      hasCompleted = !!attempt;
    }

    // Format questions (hide answers)
    const questions = dailyQuiz.questions.map(q => ({
      id: q._id,
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      difficulty: q.difficulty,
      tags: q.tags,
      isBonus: q.isBonus,
    }));

    res.status(200).json({
      quizId: dailyQuiz._id,
      date: dailyQuiz.date,
      expiresAt: dailyQuiz.expiresAt,
      questions,
      hasCompleted,
    });
  } catch (error) {
    console.error('Get daily quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

