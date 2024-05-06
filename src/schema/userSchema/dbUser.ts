import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// const dbuserSchema = new mongoose.Schema({
//     username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     password: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     empID:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     role:     { type: String, required: true },
//     database: { type: String, required: true },
//     host:     { type: String, required: true },
//   });

// const dbuserSchema = new mongoose.Schema({
//     username: { type: String, required: true  },
//     password: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     empID:    { type: Number, required: true  },
//     role:     { type: String, required: true },
//     database: { type: String, required: true },
//     host:     { type: String, required: true },
//   });

// const dbUser=mongoose.model('dbUser',dbuserSchema)

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

const dbUser = mongoose.model<dbUser & { password: string }>('dbUser', dbuserSchema);

export default dbUser;
