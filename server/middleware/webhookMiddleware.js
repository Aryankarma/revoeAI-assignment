import { createHmac, timingSafeEqual } from "crypto";
import { configDotenv } from "dotenv";
configDotenv();

const validateWebhookSignature = (req, res, next) => {
  console.log("inside webhook middleware function");
  try {
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    console.log("inside webhook middleware");
    console.log("Webhook signature:", razorpaySignature);
    console.log("Webhook secret:", webhookSecret);

    if (!razorpaySignature) {
      return res.status(400).json({ error: "Signature missing" });
    }

    const rawBody = req.rawBody;

    // 🔐 Ensure rawBody is a Buffer
    if (!Buffer.isBuffer(rawBody)) {
      console.error("Expected Buffer, got:", typeof rawBody);
      return res.status(400).json({ error: "Invalid body format" });
    }

    // Generate HMAC from rawBody
    const generatedSignature = createHmac("sha256", webhookSecret)
      .update(req.rawBody)
      .digest("hex");

    if (razorpaySignature === generatedSignature) {
      // Signature valid
      console.log("Signature valid")
      req.razorpayEvent = JSON.parse(rawBody.toString("utf8"))
      console.log("consoling the actual razorpay webhook event")
      console.dir(req.razorpayEvent, { depth: null })
      return next()
    }

    // signature mismatch
    return res.status(400).json({ error: "Invalid webhook signature" })
  } catch (error) {
    console.error("Webhook signature verification error:", error)
    res.status(400).json({ error: "Signature verification failed" })
  }
}

export default validateWebhookSignature;
