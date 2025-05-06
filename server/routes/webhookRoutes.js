import { Router } from "express";
const router = Router();

import { handleRazorpayWebhook } from "../controllers/webhookController.js";
import validateWebhookSignature from "../middleware/webhookMiddleware.js";

router.post("/razorpay", validateWebhookSignature, handleRazorpayWebhook);

router.get("/razorpay", (req, res) => {
  console.log("Webhook endpoint is working");
  res.send({ message: "Webhook endpoint is working" });
});

export default router;