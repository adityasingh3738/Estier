import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Post from '../../../models/Post';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const posts = await Post.find({ author: id, isAnonymous: false })
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({ user, posts });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const userId = getUserFromRequest(req);
      if (!userId || userId !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { topRappers, avatar } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { topRappers, avatar },
        { new: true }
      ).select('-password');

      res.status(200).json({ user });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
