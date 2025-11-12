import { Router } from 'express';
import multer from 'multer';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { deleteResume, getResume, listResumes, uploadResume } from '../controllers/resume.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

router.post('/', requireAuth, upload.single('file'), uploadResume);
router.get('/', requireAuth, listResumes);
router.get('/:id', requireAuth, getResume);
router.delete('/:id', requireAuth, deleteResume);

export default router;
