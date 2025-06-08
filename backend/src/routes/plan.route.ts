import { Router } from 'express';
import { createPlan, getAllPlans, searchPlansById} from '../controllers/plan.controller';

const router = Router();

router.post('/', createPlan);
router.get('/', getAllPlans);
router.get('/plan/:planId', searchPlansById);

export default router;
