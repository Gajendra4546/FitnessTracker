import { Router } from 'express';
import { createPlan, getAllPlans, searchPlansByName} from '../controllers/plan.controller';

const router = Router();

router.post('/', createPlan);
router.get('/', getAllPlans);
router.get('/search', searchPlansByName);

export default router;
