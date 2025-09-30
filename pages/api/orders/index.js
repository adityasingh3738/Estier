import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const userId = getUserFromRequest(req);
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { items, total } = req.body;

      const order = await Order.create({
        user: userId,
        items,
        total,
      });

      res.status(201).json({ order });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const userId = getUserFromRequest(req);
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const orders = await Order.find({ user: userId })
        .populate('items.product')
        .sort({ createdAt: -1 });

      res.status(200).json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
