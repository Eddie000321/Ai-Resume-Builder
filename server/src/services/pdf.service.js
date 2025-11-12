import pdf from 'pdf-parse';
import { logger } from '../lib/logger.js';

export async function extractTextFromPdf(input) {
  try {
    const data = await pdf(input);
    return {
      text: data.text,
      meta: {
        pages: data.numpages,
        info: data.info ?? {},
      },
    };
  } catch (error) {
    logger.error({ error }, 'PDF parse failed');
    throw error;
  }
}
