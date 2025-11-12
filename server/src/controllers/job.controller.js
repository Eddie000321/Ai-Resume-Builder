import mongoose from 'mongoose';
import { z } from 'zod';
import { Job } from '../models/Job.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const jobSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  company: z.string().min(2).max(120).optional(),
  rawText: z.string().min(80, 'Job description is too short'),
});

const objectIdSchema = z.string().refine((val) => mongoose.isValidObjectId(val), {
  message: 'Invalid id',
});

export const createJob = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = jobSchema.parse(req.body);
  const job = await Job.create({
    ...payload,
    userId: req.user._id,
  });

  return res.status(201).json({ job });
});

export const listJobs = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json({ jobs });
});

export const deleteJob = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const id = objectIdSchema.parse(req.params.id);
  await Job.findOneAndDelete({ _id: id, userId: req.user._id });
  return res.status(204).send();
});
