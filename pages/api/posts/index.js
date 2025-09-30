import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import User from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const posts = await Post.find()
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(50);

      res.status(200).json({ posts });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const userId = getUserFromRequest(req);
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { content, isAnonymous, type, mediaUrl, linkUrl } = req.body;

      const post = await Post.create({
        content,
        author: userId,
        isAnonymous: isAnonymous || false,
        type: type || 'text',
        mediaUrl,
        linkUrl,
      });

      const populatedPost = await Post.findById(post._id).populate('author', 'username avatar');

      res.status(201).json({ post: populatedPost });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
