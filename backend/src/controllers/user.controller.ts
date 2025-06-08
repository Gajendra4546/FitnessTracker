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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
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

    const user = await User.findById(userId);

    // Check if plan is already selected
    if (user.selectedPlans.some((p: any) => p.plan.toString() === planId)) {
      return res.status(400).json({ error: 'Plan already selected' });
    }

    user.selectedPlans.push({
      plan: planId,
      progress: { daysCompleted: 0, dailyLogs: [] },
    });

    await user.save();

    res.json({ message: 'Plan selected', plan: plan.name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to select plan', details: err.message });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('selectedPlans.plan'); // <-- populate here!
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user details', details: err.message });
  }
};

export const logExercise = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId, date, exerciseId } = req.body;

    const user = await User.findById(userId).populate('selectedPlans.plan');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const selectedPlanObj = user.selectedPlans.find((p: any) => p.plan._id.toString() === planId);
    if (!selectedPlanObj) return res.status(400).json({ error: 'Plan not selected' });

    const plan = selectedPlanObj.plan as any;
    const exercise = plan.exercises.find((ex: any) => ex._id.toString() === exerciseId);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found in plan' });

    selectedPlanObj.progress.dailyLogs.push({
      date,
      exercise: {
        id: exercise._id,
        name: exercise.name,
        duration: exercise.duration,
        intensity: exercise.intensity,
      },
    });

    await user.save();

    res.json({ message: 'Exercise logged successfully', exercise: exercise.name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log exercise', details: err.message });
  }
};

export const getMySelectedPlans = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
   const user = await User.findById(userId).select('-password').populate('selectedPlans.plan');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      userId: user._id,
      username: user.username,
      selectedPlans: user.selectedPlans.map((p: any) => ({
        plan: p.plan,
        progress: p.progress,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch selected plans', details: err.message });
  }
};

