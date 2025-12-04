// tests/createMatch.test.js

// -----------------------
// Apply mocks BEFORE loading the controller
// -----------------------

import { Resume } from "../src/models/Resume.js";
import { Job } from "../src/models/Job.js";
import { Match } from "../src/models/Match.js";
import { embedText } from "../src/services/embed.service.js";
import { computeScores } from "../src/services/score.service.js";
import { generateSuggestions } from "../src/services/suggest.service.js";
import { queryResumenRec } from "../src/services/ai.query.service.js";

// mock model functions
Resume.findOne = async () => ({
  _id: "resume1",
  userId: "user123",
  text: "fake resume text",
  embedding: null,
  save: async () => {},
});

Job.findOne = async () => ({
  _id: "job1",
  userId: "user123",
  title: "some",
  rawText: "fake job text",
  embedding: null,
  save: async () => {},
});

Match.create = async () => ({ _id: "match1" });
Match.findByIdAndUpdate = async () => {};

// mock services

const LLMMatch = await queryResumenRec(
  Resume,
  Job)

console.log(LLMMatch)

// -----------------------
// IMPORT CONTROLLER *AFTER* MOCKS
// -----------------------
const { createMatch } = await import("../src/controllers/match.controller.js");

// -----------------------
// Fake req and res
// -----------------------
const req = {
  user: { _id: "user123" },
  body: {
    resumeId: "65b1c9e8d123456789abcdef",
    jobId: "65b1c9e8d123456789abcdee",
  },
};

const res = {
  code: 200,
  status(code) {
    this.code = code;
    return this;
  },
  json(data) {
    console.log("RESPONSE", this.code, data);
  },
};

// -----------------------
// RUN
// -----------------------
createMatch(req, res);
