import mongoose from 'mongoose';
import { z } from 'zod';
import { Match } from '../models/Match.js';
import { Resume } from '../models/Resume.js';
import { Job } from '../models/Job.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { embedText } from '../services/embed.service.js';
import { computeScores } from '../services/score.service.js';
import { generateSuggestions } from '../services/suggest.service.js';

const objectId = z
  .string()
  .refine((val) => mongoose.isValidObjectId(val), 'Invalid id')
  .transform((val) => new mongoose.Types.ObjectId(val));

const createMatchSchema = z.object({
  resumeId: objectId,
  jobId: objectId,
});

export const createMatch = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = createMatchSchema.parse(req.body);
  const [resume, job] = await Promise.all([
    Resume.findOne({ _id: payload.resumeId, userId: req.user._id }),
    Job.findOne({ _id: payload.jobId, userId: req.user._id }),
  ]);

  if (!resume || !job) {
    return res.status(404).json({ message: 'Resume or job not found' });
  }

  const match = await Match.create({
    userId: req.user._id,
    resumeId: resume._id,
    jobId: job._id,
    status: 'running',
  });

  try {
    const resumeEmbedding =
      resume.embedding ?? (await embedText(resume.text ?? '', `resume:${resume._id}`));
    const jobEmbedding = job.embedding ?? (await embedText(job.rawText, `job:${job._id}`));

    if (!resume.embedding) {
      resume.embedding = resumeEmbedding;
      await resume.save();
    }
    if (!job.embedding) {
      job.embedding = jobEmbedding;
      await job.save();
    }

    const { scores, details } = computeScores({
      resumeText: resume.text ?? '',
      jobText: job.rawText,
      resumeEmbedding,
      jobEmbedding,
    });
    const suggestions = await generateSuggestions({
      resumeText: resume.text ?? '',
      jobText: job.rawText,
      scores,
      details,
    });

    await Match.findByIdAndUpdate(match._id, {
      status: 'done',
      scores,
      details,
      suggestions,
    });
  } catch (error) {
    await Match.findByIdAndUpdate(match._id, {
      status: 'error',
      errorMsg: error?.message ?? 'Unknown error',
    });
    return res.status(500).json({ message: 'Failed to compute match' });
  }

  return res.status(202).json({ matchId: match._id });
});

export const getMatch = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const id = objectId.parse(req.params.id);
  const match = await Match.findOne({ _id: id, userId: req.user._id }).lean();
  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }

  return res.json({ match });
});

export const listMatches = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { resumeId, jobId } = req.query;
  const query = { userId: req.user._id };
  if (typeof resumeId === 'string' && mongoose.isValidObjectId(resumeId)) {
    query.resumeId = resumeId;
  }
  if (typeof jobId === 'string' && mongoose.isValidObjectId(jobId)) {
    query.jobId = jobId;
  }

  const matches = await Match.find(query).sort({ createdAt: -1 }).limit(20).lean();
  return res.json({ matches });
});
