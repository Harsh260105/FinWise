import { createOrder } from '../../../services/subscriptionService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;
    const order = await createOrder(userId);
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
} 