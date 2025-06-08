import { Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Plan from '../models/plan.model';
import bcrypt from 'bcrypt';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    console.error('Signup Error:', err);
  res.status(500).json({ error: 'Signup failed', details: err.message || err });
  }
};

export const signin = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'supersecretkey123', { expiresIn: '7d' });
  res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Signin failed', details: err });
  }
};
export const selectPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { selectedPlan: planId, progress: { daysCompleted: 0, dailyLogs: [] } },
      { new: true }
    );

    res.json({ message: 'Plan selected', plan: plan.name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to select plan', details: err.message });
  }
};

export const logExercise = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    console.log(req)
    const { date, exercisesDone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Add new log
    user.progress.dailyLogs.push({ date, exercisesDone });
    user.progress.daysCompleted += 1;

    await user.save();

    res.json({ message: 'Exercise logged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log exercise', details: err.message });
  }
};

