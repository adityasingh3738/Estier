import dbConnect from '../../../lib/mongodb';
import ChatRoom from '../../../models/ChatRoom';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const chatRooms = await ChatRoom.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({ chatRooms });
    } catch (error) {
      console.error('Get chatrooms error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
