import { verifyPayment } from '../../../services/subscriptionService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { paymentId, orderId, userId } = req.body;
    const subscription = await verifyPayment(paymentId, orderId, userId);
    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
} 