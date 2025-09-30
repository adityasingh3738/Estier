import dbConnect from '../../../lib/mongodb';
import Artist from '../../../models/Artist';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { type } = req.query;

      let query = {};
      if (type === 'hot') {
        const artists = await Artist.find().sort({ hotScore: -1 }).limit(10);
        return res.status(200).json({ artists });
      } else if (type === 'emerging') {
        query.isEmerging = true;
      }

      const artists = await Artist.find(query).sort({ createdAt: -1 });
      res.status(200).json({ artists });
    } catch (error) {
      console.error('Get artists error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
