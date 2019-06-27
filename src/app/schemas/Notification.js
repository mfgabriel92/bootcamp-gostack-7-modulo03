import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default model('Notification', NotificationSchema)
