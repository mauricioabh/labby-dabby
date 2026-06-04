import { PDFParse } from 'pdf-parse';

export async function extractTextFromPdfUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const parser = new PDFParse({ data: Buffer.from(buffer) });
  const result = await parser.getText();
  return result.text ?? '';
}
