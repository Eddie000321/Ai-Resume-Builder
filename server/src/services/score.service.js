export function computeScores(ctx) {
  const semantic = cosine(ctx.resumeEmbedding, ctx.jobEmbedding);
  const { coverage, missingKeywords } = keywordCoverage(ctx.jobText, ctx.resumeText);
  const experience = heuristicExperience(ctx.jobText, ctx.resumeText);
  const ats = atsHeuristic(ctx.resumeText);
  const skills = clamp((coverage + semantic) / 2, 0, 1);
  const overall =
    0.35 * semantic + 0.25 * coverage + 0.2 * experience + 0.1 * skills + 0.1 * ats;

  return {
    scores: {
      overall: round(overall),
      semantic: round(semantic),
      keyword: round(coverage),
      experience: round(experience),
      skills: round(skills),
      ats: round(ats),
    },
    details: {
      missingKeywords,
      weakSections: [],
      experienceGaps: [],
    },
  };
}

function cosine(a, b) {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
}

function keywordCoverage(jobText, resumeText) {
  const jobTokens = tokenize(jobText);
  const resumeTokens = new Set(tokenize(resumeText));
  const keywords = Array.from(jobTokens).slice(0, 20);
  const hits = keywords.filter((token) => resumeTokens.has(token));

  return {
    coverage: keywords.length ? hits.length / keywords.length : 0,
    missingKeywords: keywords.filter((token) => !resumeTokens.has(token)),
  };
}

function heuristicExperience(jobText, resumeText) {
  const jobYears = extractYears(jobText);
  const resumeYears = extractYears(resumeText);
  if (!jobYears || !resumeYears) return 0.5;
  const ratio = resumeYears / jobYears;
  return clamp(ratio >= 1 ? 1 : ratio * 0.8, 0, 1);
}

function atsHeuristic(resumeText) {
  const hasTables = /table|columns?/i.test(resumeText);
  const hasContact = /(email|phone|\d{3}[-)\s]?\d{3})/i.test(resumeText);
  let score = 0.8;
  if (hasTables) score -= 0.2;
  if (!hasContact) score -= 0.2;
  return clamp(score, 0, 1);
}

const YEAR_REGEX = /(\d+)\s*(?:\+?\s*)?(?:years|yrs)/i;

function extractYears(text) {
  const match = text.match(YEAR_REGEX);
  return match ? Number(match[1]) : null;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round(value) {
  return value === undefined ? undefined : Math.round(value * 100) / 100;
}
