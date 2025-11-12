import { Readable } from 'node:stream';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Resume } from '../models/Resume.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFile, saveFile } from '../services/storage.service.js';
import { extractTextFromPdf } from '../services/pdf.service.js';

const objectIdSchema = z.string().refine((val) => mongoose.isValidObjectId(val), {
  message: 'Invalid id',
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  const stream = Readable.from(file.buffer);
  const fileId = await saveFile(file.originalname, stream);
  const extracted = await extractTextFromPdf(file.buffer);

  const resume = await Resume.create({
    userId: req.user._id,
    fileId,
    filename: file.originalname,
    text: extracted.text,
    parsedMeta: {},
  });

  return res.status(201).json({ resume });
});

export const listResumes = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json({ resumes });
});

export const getResume = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const id = objectIdSchema.parse(req.params.id);
  const resume = await Resume.findOne({ _id: id, userId: req.user._id }).lean();
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  return res.json({ resume });
});

export const deleteResume = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const id = objectIdSchema.parse(req.params.id);
  const resume = await Resume.findOneAndDelete({ _id: id, userId: req.user._id });
  if (resume) {
    await deleteFile(resume.fileId);
  }

  return res.status(204).send();
});
