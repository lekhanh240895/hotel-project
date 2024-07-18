import { model, Schema, models } from 'mongoose';

const ConversationSchema = new Schema(
  {
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  { timestamps: true }
);

export default models.Message || model<IMessage>('Message', ConversationSchema);
