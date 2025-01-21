import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  createOrder,
  connectVisaCard,
  connectCryptoWallet,
  finishOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/order.controllers.js';

const router = express.Router();

router.post('/create/:productId', verifyToken, createOrder);
router.post('/connect-visa-card', verifyToken, connectVisaCard);
router.post('/connect-crypto-wallet', verifyToken, connectCryptoWallet);

router.post('/:id/cancel', verifyToken, cancelOrder);
router.post('/:id/finish', verifyToken, finishOrder);

router.get('/my-orders', verifyToken, getMyOrders);

router.get('/my-orders/:id', verifyToken, getOrderById);

export default router;
