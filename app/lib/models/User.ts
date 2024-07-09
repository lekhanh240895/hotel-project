import { model, Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    full_name: { type: String },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required']
    },
    image: { type: String, default: '' },
    password: { type: String, default: '' },
    role: { type: String, default: 'user' }
  },
  {
    timestamps: true
  }
);

export default models.User || model<User>('User', UserSchema);
