import { Router } from "express";
import protect from "../middleware/authMiddleware.js"; // auth midleware
import razorInstance from "../config/razorpayInstance.js";
import crypto from "crypto";
import User from "../models/User.js";

const router = Router();

router.get("/createSubscription", async (req, res) => {
  const authHeader = req.header("Authorization");
  console.log(authHeader);
  console.log("creating subscription");
  try {
    const subscription = await razorInstance.subscriptions.create({
      plan_id: "plan_QMmiN4YrD79qf6", // Pro Plan ID
      total_count: 1, // active for 1 months
      customer_notify: 1,
    })
    
    console.log(subscription);

    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    console.log("Error creating subscription");
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/verify", protect, async (req, res) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  // get user from db
  const user = await User.findById(req.user);

  console.log("user : ", user);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // create the proper dates
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  console.log("verifying signature");
  console.log(
    "details : ",
    razorpay_payment_id,
    " + ",
    razorpay_subscription_id,
    " + ",
    razorpay_signature
  );

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(razorpay_payment_id + "|" + razorpay_subscription_id)
    .digest("hex");

  console.log("verify status : ");
  console.log(generatedSignature === razorpay_signature);
  console.log(req.user);

  if (generatedSignature === razorpay_signature) {
    // Payment verified ✅
    // Update user to "Pro" plan in the DB

    // Update currentPlan and push to subscriptionHistory
    user.currentPlan = {
      name: "pro",
      isPaid: true,
      subscriptionId: razorpay_subscription_id,
      subscriptionStatus: "active",
      startedAt: now,
      expiresAt: oneMonthLater,
    };

    user.subscriptionHistory.push({
      subscriptionId: razorpay_subscription_id,
      name: "pro",
      isPaid: true,
      status: "active",
      startedAt: now,
      expiresAt: oneMonthLater,
      paymentDate: now,
    });

    await user.save();

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

export default router;
