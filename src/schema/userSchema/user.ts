import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


interface IUser {
  username: string;
  empID: number
}

// User schema with password hashing
const userSchema = new mongoose.Schema<IUser & { password: string }>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  empID: { type: Number, required: true, unique: true }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userdb=mongoose.connection.useDb('users');

const User = userdb.model<IUser & { password: string }>('user', userSchema);

export default User;