import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export async function generateSuggestions(ctx) {
  if (!env.LLM_API_KEY || !env.LLM_MODEL || !env.LLM_PROVIDER) {
    return fallbackSuggestions(ctx);
  }

  try {
    const response = await axios.post(
      env.LLM_PROVIDER,
      {
        model: env.LLM_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert ATS career coach. Provide short, actionable resume improvements.',
          },
          {
            role: 'user',
            content: serializePrompt(ctx),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${env.LLM_API_KEY}`,
        },
      }
    );

    const text = response.data.choices?.[0]?.message?.content ?? '';
    return text
      .split('\n')
      .map((line) => line.replace(/^\s*[-•]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 6);
  } catch (error) {
    logger.error({ error }, 'LLM suggestion call failed; using fallback suggestions');
    return fallbackSuggestions(ctx);
  }
}

function fallbackSuggestions(ctx) {
  const missing = ctx.details.missingKeywords?.slice(0, 3) ?? [];
  const suggestions = [];

  if (missing.length) {
    suggestions.push(`Add keywords: ${missing.join(', ')}`);
  }
  if ((ctx.scores.experience ?? 0) < 0.7) {
    suggestions.push('Quantify impact for relevant roles to showcase years of experience.');
  }
  if ((ctx.scores.ats ?? 0) < 0.7) {
    suggestions.push('Ensure contact info is at the top and remove multi-column layouts.');
  }

  return suggestions.length ? suggestions : ['Highlight measurable outcomes under each role.'];
}

function serializePrompt(ctx) {
  return `
Job Description:
${ctx.jobText.slice(0, 2000)}

Resume:
${ctx.resumeText.slice(0, 2000)}

Scores: ${JSON.stringify(ctx.scores)}
Details: ${JSON.stringify(ctx.details)}
Please respond with 3 concise bullet suggestions.`;
}
