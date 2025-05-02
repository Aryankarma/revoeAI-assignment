import { createHmac, timingSafeEqual } from "crypto";
import { configDotenv } from "dotenv";
configDotenv();


const validateWebhookSignature = (req, res, next) => {
  try {
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!razorpaySignature) {
      return res.status(400).json({ error: "Signature missing" });
    }

    // Generate HMAC from rawBody
    const generatedSignature = createHmac("sha256", webhookSecret)
      .update(req.rawBody)
      .digest("hex");

    // Validate with timingSafeEqual
    const isValid = timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature)
    );

    console.log("Webhook Signature Validation");
    console.log("Generated: ", generatedSignature);
    console.log("Received: ", razorpaySignature);
    console.log("Valid: ", isValid);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    next();
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    res.status(400).json({ error: "Signature verification failed" });
  }
};

export default validateWebhookSignature;
