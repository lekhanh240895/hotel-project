import { model, Schema, models } from 'mongoose';

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: { type: String, trim: true, required: true },
    role: {
      type: String,
      enum: ['system', 'user', 'assistant'],
      required: true
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    }
  },
  { timestamps: true }
);

export default models.Message || model<Message>('Message', MessageSchema);
