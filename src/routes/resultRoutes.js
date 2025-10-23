import { Router } from 'express';
import { submitResult } from '../controllers/resultController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, submitResult);


export default router;
