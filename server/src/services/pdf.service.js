import { PDFParse } from 'pdf-parse';
import { logger } from '../lib/logger.js';

export async function extractTextFromPdf(input) {
  let parser;
  try {
    parser = new PDFParse({ data: input });
    const textResult = await parser.getText();

    let info = {};
    try {
      const infoResult = await parser.getInfo({ parsePageInfo: false });
      info = infoResult?.info ?? {};
    } catch (metaError) {
      logger.warn({ error: metaError }, 'PDF metadata parse failed');
    }

    return {
      text: textResult.text,
      meta: {
        pages: textResult.total,
        info,
      },
    };
  } catch (error) {
    logger.error({ error }, 'PDF parse failed');
    throw error;
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
}
