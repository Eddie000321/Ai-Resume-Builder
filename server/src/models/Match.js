import { Schema, model } from 'mongoose';

const matchSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['queued', 'running', 'done', 'error'],
      default: 'queued',
      index: true,
    },
    scores: {
      overall: Number,
      semantic: Number,
      keyword: Number,
      experience: Number,
      skills: Number,
      ats: Number,
    },
    details: {
      missingKeywords: [String],
      weakSections: [{ section: String, why: String }],
      experienceGaps: [{ jdRequirement: String, tip: String }],
    },
    suggestions: [String],
    errorMsg: String,
  },
  { timestamps: true }
);

export const Match = model('Match', matchSchema);
