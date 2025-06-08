import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedPlans: [
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    progress: {
      daysCompleted: { type: Number, default: 0 },
      dailyLogs: [
        {
          date: String,
          exercise: {
            id: String,
            name: String,
            duration: Number,
            intensity: String,
          },
        },
      ],
    },
  },
],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
