import { model, Schema, models } from 'mongoose';

const ResetPasswordTokenSchema = new Schema(
  {
    reset_password_token: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

export default models.Reset_Password_Token ||
  model<ResetPasswordToken>('Reset_Password_Token', ResetPasswordTokenSchema);
