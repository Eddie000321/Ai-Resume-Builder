import { Schema, model } from 'mongoose';

const jobSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String },
    company: { type: String },
    rawText: { type: String, required: true },
    tokens: { type: Number },
    embedding: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

export const Job = model('Job', jobSchema);
