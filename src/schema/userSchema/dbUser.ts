import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


interface dbUser {
  username: string;
  empID: number;
  role: string;
  database: string;
  host: string
}

const dbuserSchema = new mongoose.Schema<dbUser & { password: string }>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role    : { type: String, required: true },
  database: { type: String, required: true },
  host: { type: String, required: true },
  empID: { type: Number, required: true, unique: true }
});

dbuserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const db=mongoose.connection.useDb('dbusers');

const dbUser = db.model<dbUser & { password: string }>('dbUser', dbuserSchema);

export default dbUser;
