import { model, Schema, models } from 'mongoose';

const RegisterTokensSchema = new Schema(
  {
    register_token: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

export default models.Register_Token ||
  model<RegisterToken>('Register_Token', RegisterTokensSchema);
