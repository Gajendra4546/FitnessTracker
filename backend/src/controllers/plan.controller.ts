import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Plan from '../models/plan.model';

export const createPlan = async (req: Request, res: Response) => {
  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json(newPlan);
  } catch (err: any) {
    console.error('Plan creation error:', err.message || err);
    res.status(500).json({ error: 'Error creating plan', details: err.message || err });
  }
};

export const searchPlansById = async (req: Request, res: Response) => {
  try {
    const planId = req.params.planId;
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }
    const plan = await Plan.findOne({ _id: planId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Error searching plan', details: err });
  }
};

export const getAllPlans = async (_: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans', details: err });
  }
};
