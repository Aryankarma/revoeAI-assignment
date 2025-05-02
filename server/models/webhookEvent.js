import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  eventType: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    required: true
  },
  processedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema)

export default WebhookEvent