import { Router } from 'express';
const router = Router();

import { handleRazorpayWebhook } from '../controllers/webhookController';
import { validateWebhookSignature } from '../middleware/webhookMiddleware';

router.post('/razorpay', validateWebhookSignature, handleRazorpayWebhook);

export default router;