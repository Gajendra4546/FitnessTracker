import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise {
  name: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface IPlan extends Document {
  name: string;
  days: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  exercises: IExercise[];
}

const ExerciseSchema: Schema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, enum: ['low', 'medium', 'high'], required: true },
});

const PlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  days: { type: Number, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  exercises: [ExerciseSchema],
});

const Plan = mongoose.model<IPlan>('Plan', PlanSchema);
export default Plan;
