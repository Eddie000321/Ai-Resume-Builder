import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPasswordHook(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await User.hashPassword(this.password);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const User = model('User', userSchema);
