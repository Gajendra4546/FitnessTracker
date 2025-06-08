import express from 'express';
import { signup, signin,selectPlan, logExercise, getMySelectedPlans, getUserDetails } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/', authenticateUser, getUserDetails);
router.post('/select-plan', authenticateUser, selectPlan);
router.get('/selected-plans', authenticateUser, getMySelectedPlans);
router.post('/log-exercise', authenticateUser, logExercise);


export default router;
