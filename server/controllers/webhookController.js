import User from '../models/User.js';
import WebhookEvent from '../models/WebhookEvent.js';

export const handleRazorpayWebhook = async (req, res) => {
  try {
    // Return 200 quickly to acknowledge receipt
    res.status(200).send({ status: 'received' });
    
    const { event, payload } = req.body;
    console.log(`Received Razorpay webhook: ${event}`);
    
    // Check for duplicate event
    const isDuplicate = await WebhookEvent.findOne({ eventId: req.body.id });
    if (isDuplicate) {
      console.log(`Duplicate event ${req.body.id} skipped`);
      return;
    }
    
    // Process the event based on type
    switch (event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(payload.subscription.entity);
        break;
      
      case 'subscription.charged':
        await handleSubscriptionCharged(payload.subscription.entity, payload.payment?.entity);
        break;
      
      case 'subscription.halted':
        await handleSubscriptionHalted(payload.subscription.entity);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.subscription.entity);
        break;
      
      case 'subscription.payment.failed':
        await handleSubscriptionPaymentFailed(payload.subscription.entity, payload.payment?.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    // Record processed event
    await WebhookEvent.create({
      eventId: req.body.id,
      eventType: event,
      payload: req.body,
      processedAt: new Date()
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Error is logged but not returned as response was already sent
  }
};

// Handler functions adapted to your user model structure

async function handleSubscriptionActivated(subscription) {
  try {
    const user = await User.findOne({ 'currentPlan.subscriptionId': subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription ${subscription.id}`);
      return;
    }
    
    // Update user's subscription status
    user.currentPlan = {
      name: "pro", // Assuming "pro" is your paid plan
      isPaid: true,
      subscriptionId: subscription.id,
      subscriptionStatus: "active",
      startedAt: new Date(subscription.current_start * 1000),
      expiresAt: new Date(subscription.current_end * 1000)
    };
    
    // Add to subscription history
    user.subscriptionHistory.push({
      subscriptionId: subscription.id,
      name: "pro",
      isPaid: true,
      status: "active",
      startedAt: new Date(subscription.current_start * 1000),
      expiresAt: new Date(subscription.current_end * 1000),
      paymentDate: new Date()
    });
    
    await user.save();
    console.log(`Subscription activated for user ${user._id}`);
    
    // Additional logic like sending welcome email, etc.
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

async function handleSubscriptionCharged(subscription, payment) {
  try {
    const user = await User.findOne({ 'currentPlan.subscriptionId': subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription ${subscription.id}`);
      return;
    }
    
    // Update expiration date based on new payment
    user.currentPlan.expiresAt = new Date(subscription.current_end * 1000);
    
    // Update subscription history with payment info
    const historyEntry = user.subscriptionHistory.find(
      entry => entry.subscriptionId === subscription.id && entry.status === "active"
    );
    
    if (historyEntry) {
      historyEntry.paymentDate = new Date();
      historyEntry.expiresAt = new Date(subscription.current_end * 1000);
    } else {
      // If no matching active subscription in history, add a new entry
      user.subscriptionHistory.push({
        subscriptionId: subscription.id,
        name: "pro",
        isPaid: true,
        status: "active",
        startedAt: new Date(subscription.current_start * 1000),
        expiresAt: new Date(subscription.current_end * 1000),
        paymentDate: new Date()
      });
    }
    
    await user.save();
    console.log(`Subscription payment recorded for user ${user._id}`);
    
    // Additional logic like sending payment confirmation, etc.
  } catch (error) {
    console.error('Error handling subscription charge:', error);
  }
}

async function handleSubscriptionHalted(subscription) {
  try {
    const user = await User.findOne({ 'currentPlan.subscriptionId': subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription ${subscription.id}`);
      return;
    }
    
    // Update user's subscription status to expired
    user.currentPlan = {
      name: "free", // Revert to free plan
      isPaid: false,
      subscriptionId: null,
      subscriptionStatus: "expired",
      startedAt: null,
      expiresAt: null
    };
    
    // Update subscription in history
    const historyEntry = user.subscriptionHistory.find(
      entry => entry.subscriptionId === subscription.id && entry.status === "active"
    );
    
    if (historyEntry) {
      historyEntry.status = "expired";
      historyEntry.expiresAt = new Date(subscription.ended_at * 1000);
    }
    
    await user.save();
    console.log(`Subscription halted/expired for user ${user._id}`);
    
    // Additional logic like sending expiration notification
  } catch (error) {
    console.error('Error handling subscription halt:', error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    const user = await User.findOne({ 'currentPlan.subscriptionId': subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription ${subscription.id}`);
      return;
    }
    
    // Update subscription status to cancelled but keep access until end date
    user.currentPlan.subscriptionStatus = "cancelled";
    
    // Update subscription in history
    const historyEntry = user.subscriptionHistory.find(
      entry => entry.subscriptionId === subscription.id && entry.status === "active"
    );
    
    if (historyEntry) {
      historyEntry.status = "cancelled";
    }
    
    await user.save();
    console.log(`Subscription cancelled for user ${user._id}`);
    
    // Additional logic like sending cancellation confirmation
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionPaymentFailed(subscription, payment) {
  try {
    const user = await User.findOne({ 'currentPlan.subscriptionId': subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription ${subscription.id}`);
      return;
    }
    
    // Add a note in logs, but don't change status yet as Razorpay will retry
    console.log(`Payment failed for subscription ${subscription.id}, user ${user._id}`);
    
    // You might want to send a notification to the user about payment failure
    
    // Optionally add payment failure to history or a separate collection
    
  } catch (error) {
    console.error('Error handling subscription payment failure:', error);
  }
}