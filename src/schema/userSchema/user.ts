import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


interface IUser {
  username: string;
}

// User schema with password hashing
const userSchema = new mongoose.Schema<IUser & { password: string }>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser & { password: string }>('user', userSchema);

export default User;