import { Request, Response } from 'express';
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

export const searchPlansByName = async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;
    const plans = await Plan.find({ name: { $regex: name, $options: 'i' } });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Error searching plans', details: err });
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
