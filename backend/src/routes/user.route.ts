import express from 'express';
import { signup, signin,selectPlan, logExercise } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/select-plan', authenticateUser, selectPlan);
router.post('/log-exercise', authenticateUser, logExercise);


export default router;
