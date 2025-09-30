import dbConnect from '../../../../lib/mongodb';
import Poll from '../../../../models/Poll';
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
    const { songIndex } = req.body;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Remove previous vote
    poll.songs.forEach((song) => {
      song.votes = song.votes.filter((vote) => vote.toString() !== userId);
    });

    // Add new vote
    if (songIndex !== undefined && poll.songs[songIndex]) {
      poll.songs[songIndex].votes.push(userId);
    }

    await poll.save();

    res.status(200).json({ poll });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
