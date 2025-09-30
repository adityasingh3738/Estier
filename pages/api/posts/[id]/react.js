import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import { getUserFromRequest } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const userId = getUserFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    const { reactionType } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingReaction = post.reactions.find(
      (r) => r.user.toString() === userId && r.type === reactionType
    );

    if (existingReaction) {
      post.reactions = post.reactions.filter(
        (r) => !(r.user.toString() === userId && r.type === reactionType)
      );
    } else {
      post.reactions.push({ user: userId, type: reactionType });
    }

    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.error('React to post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
