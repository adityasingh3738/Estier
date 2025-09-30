import dbConnect from '../../../lib/mongodb';
import Poll from '../../../models/Poll';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
      res.status(200).json({ polls });
    } catch (error) {
      console.error('Get polls error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const userId = getUserFromRequest(req);
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { title, description, songs } = req.body;

      const poll = await Poll.create({
        title,
        description,
        songs: songs.map(song => ({ ...song, votes: [] })),
      });

      res.status(201).json({ poll });
    } catch (error) {
      console.error('Create poll error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
