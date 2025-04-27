import { Router } from "express";
import protect from "../middleware/authMiddleware.js"; // auth midleware
import User from "../models/User.js";

const router = Router();

router.get("/getDashboardConfig", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    console.log("user from get dashboard : ", user)
    console.log("getdashboard config got called.")

    const isPro =
      user?.currentPlan?.isPaid &&
      user?.currentPlan?.subscriptionStatus === "active";

    res.status(200).json({
      success: true,
      isPro,
      userData: {
        name: user.name,
        email: user.email,
        currentPlan: user.currentPlan.name,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard data." });
  }
});


export default router