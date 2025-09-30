import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { type } = req.query;

      let query = {};
      if (type) {
        query.type = type;
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      res.status(200).json({ products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
