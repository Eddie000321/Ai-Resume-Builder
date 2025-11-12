import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createJob, deleteJob, listJobs } from '../controllers/job.controller.js';

const router = Router();

router.post('/', requireAuth, createJob);
router.get('/', requireAuth, listJobs);
router.delete('/:id', requireAuth, deleteJob);

export default router;
