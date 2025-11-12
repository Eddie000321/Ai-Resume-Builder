import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createMatch, getMatch, listMatches } from '../controllers/match.controller.js';

const router = Router();

router.post('/', requireAuth, createMatch);
router.get('/', requireAuth, listMatches);
router.get('/:id', requireAuth, getMatch);

export default router;
