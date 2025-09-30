import dbConnect from '../../../lib/mongodb';
import QuizAttempt from '../../../models/QuizAttempt';
import User from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { scope = 'global', limit = 50 } = req.query;
    const userId = getUserFromRequest(req);

    let query = {};
    
    if (scope === 'friends' && userId) {
      const currentUser = await User.findById(userId);
      const friendIds = [...currentUser.following, userId];
      query.user = { $in: friendIds };
    } else if (scope === 'city' && userId) {
      const currentUser = await User.findById(userId);
      if (currentUser.city) {
        const cityUsers = await User.find({ city: currentUser.city }).select('_id');
        query.user = { $in: cityUsers.map(u => u._id) };
      }
    }

    // Get top attempts (one per user, their best score)
    const leaderboard = await QuizAttempt.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$user',
          maxScore: { $max: '$score' },
          totalQuizzes: { $sum: 1 },
          perfectCount: {
            $sum: { $cond: ['$isPerfect', 1, 0] }
          },
          currentStreak: { $max: '$streak' },
        }
      },
      { $sort: { maxScore: -1, totalQuizzes: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          city: '$user.city',
          totalXP: '$user.totalXP',
          maxScore: 1,
          totalQuizzes: 1,
          perfectCount: 1,
          currentStreak: 1,
        }
      }
    ]);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.status(200).json({
      scope,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

