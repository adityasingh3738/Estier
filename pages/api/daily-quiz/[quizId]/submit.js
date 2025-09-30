import dbConnect from '../../../../lib/mongodb';
import DailyQuiz from '../../../../models/DailyQuiz';
import Question from '../../../../models/Question';
import QuizAttempt from '../../../../models/QuizAttempt';
import User from '../../../../models/User';
import { getUserFromRequest } from '../../../../lib/auth';

// Helper function to check if answer is correct
function checkAnswer(question, userAnswer) {
  const correctAnswer = question.answer;
  
  if (question.type === 'short_answer') {
    // Normalize and check multiple accepted answers
    const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
    
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(ans => 
        String(ans).trim().toLowerCase() === normalizedUserAnswer
      );
    }
    
    return String(correctAnswer).trim().toLowerCase() === normalizedUserAnswer;
  }
  
  if (question.type === 'true_false') {
    return String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase();
  }
  
  // MCQ
  return String(userAnswer) === String(correctAnswer);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { quizId } = req.query;
    const { answers } = req.body; // { questionId: { answer, timeSpent }, ... }

    // Check if user already completed this quiz
    const existingAttempt = await QuizAttempt.findOne({
      user: userId,
      dailyQuiz: quizId,
    });

    if (existingAttempt) {
      return res.status(400).json({ message: 'Quiz already completed' });
    }

    const dailyQuiz = await DailyQuiz.findById(quizId).populate('questions');
    if (!dailyQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let totalScore = 0;
    let correctCount = 0;
    const answerResults = [];

    for (const question of dailyQuiz.questions) {
      const userResponse = answers[question._id];
      const isCorrect = userResponse ? checkAnswer(question, userResponse.answer) : false;
      
      let points = 0;
      if (isCorrect) {
        correctCount++;
        points = question.isBonus ? 20 : 10;
        totalScore += points;
      }

      answerResults.push({
        question: question._id,
        userAnswer: userResponse?.answer,
        isCorrect,
        points,
        timeSpent: userResponse?.timeSpent || 0,
      });
    }

    // Calculate streak
    const user = await User.findById(userId);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    let newStreak = 1;
    if (user.lastQuizDate) {
      const lastQuizDate = new Date(user.lastQuizDate);
      lastQuizDate.setUTCHours(0, 0, 0, 0);
      
      if (lastQuizDate.getTime() === yesterday.getTime()) {
        // Continue streak
        newStreak = (user.quizStreak || 0) + 1;
      }
    }

    // Apply streak bonus (caps at +7 XP)
    const streakBonus = Math.min(newStreak, 7);
    const totalXP = totalScore + streakBonus;

    // Check for perfect score
    const isPerfect = correctCount === dailyQuiz.questions.length;

    // Award badges
    const newBadges = [];
    if (isPerfect && !user.badges.includes('perfect_quiz')) {
      newBadges.push('perfect_quiz');
    }
    if (newStreak === 7 && !user.badges.includes('7_day_streak')) {
      newBadges.push('7_day_streak');
    }
    if (newStreak === 30 && !user.badges.includes('30_day_streak')) {
      newBadges.push('30_day_streak');
    }

    // Save attempt
    const attempt = await QuizAttempt.create({
      user: userId,
      dailyQuiz: quizId,
      answers: answerResults,
      score: totalScore,
      correctCount,
      streak: newStreak,
      totalXP,
      isPerfect,
    });

    // Update user
    user.quizStreak = newStreak;
    user.lastQuizDate = today;
    user.totalXP = (user.totalXP || 0) + totalXP;
    user.badges = [...new Set([...user.badges, ...newBadges])];
    await user.save();

    // Get correct answers for display
    const questionsWithAnswers = dailyQuiz.questions.map(q => ({
      id: q._id,
      prompt: q.prompt,
      correctAnswer: q.answer,
      explanation: q.explanation,
      userAnswer: answers[q._id]?.answer,
      isCorrect: answerResults.find(a => a.question.toString() === q._id.toString())?.isCorrect,
    }));

    res.status(200).json({
      score: totalScore,
      correctCount,
      totalQuestions: dailyQuiz.questions.length,
      streak: newStreak,
      streakBonus,
      totalXP,
      isPerfect,
      newBadges,
      questions: questionsWithAnswers,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

