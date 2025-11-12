import { Schema, model } from 'mongoose';

const parsedMetaSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    skills: [String],
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileId: { type: String, required: true },
    filename: { type: String },
    text: { type: String },
    tokens: { type: Number },
    embedding: { type: [Number], default: undefined },
    parsedMeta: { type: parsedMetaSchema },
  },
  { timestamps: true }
);

export const Resume = model('Resume', resumeSchema);
