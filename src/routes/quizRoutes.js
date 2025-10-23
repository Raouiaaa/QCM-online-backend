import { Router } from 'express';
import { getQuizzes, getQuizById } from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', getQuizzes);
router.get('/:id', auth, getQuizById);

export default router;
