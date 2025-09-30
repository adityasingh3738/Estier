import dbConnect from '../../../lib/mongodb';
import News from '../../../models/News';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const news = await News.find()
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .limit(20);

      res.status(200).json({ news });
    } catch (error) {
      console.error('Get news error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
