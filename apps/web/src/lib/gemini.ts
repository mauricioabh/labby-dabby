import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/env';

const genAI = env.GOOGLE_GENERATIVE_AI_API_KEY
  ? new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY)
  : null;

export interface LabAnalysisResult {
  summary: string;
  detailed: string;
  status: 'normal' | 'abnormal' | 'critical';
  suggestedQuestions: string[];
  reportDate: string | null;
}

const ANALYSIS_PROMPT = `You are a medical lab report interpreter for patients. Analyze the following lab report text and provide:

1. A brief summary (2-3 sentences) in plain language for the patient.
2. A detailed analysis in markdown format, organized by category (e.g., Blood Count, Chemistry, etc.). For each result: state the value, reference range if available, whether it's normal/abnormal, and a simple explanation.
3. Overall status: "normal" (all within range), "abnormal" (some values outside range but not critical), or "critical" (values that need immediate medical attention).
4. 3-5 suggested questions the patient could ask their doctor.

Respond with valid JSON only, no markdown code blocks:
{
  "summary": "string",
  "detailed": "string (markdown)",
  "status": "normal" | "abnormal" | "critical",
  "suggestedQuestions": ["string"],
  "reportDate": "YYYY-MM-DD or null if not found"
}`;

const CHAT_SYSTEM_PROMPT = `You are a helpful health assistant. You help patients understand their lab results in plain language. 
Be empathetic, clear, and never give medical advice or diagnoses. Always recommend consulting a doctor for medical decisions.
If the user has shared lab report context, use it to answer their questions. Otherwise, provide general guidance.`;

export async function analyzeLabReport(extractedText: string): Promise<LabAnalysisResult> {
  if (!genAI) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`${ANALYSIS_PROMPT}\n\nLab report text:\n${extractedText}`);
  const response = result.response;
  const text = response.text();

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = text.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr) as LabAnalysisResult;

  // Validate status
  const validStatuses = ['normal', 'abnormal', 'critical'] as const;
  if (!validStatuses.includes(parsed.status)) {
    parsed.status = 'normal';
  }

  return parsed;
}

export async function chatWithContext(
  userMessage: string,
  reportContext: string | null,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!genAI) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const contextPart = reportContext
    ? `\n\nLab report context (use this to answer questions):\n${reportContext}`
    : '';

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: CHAT_SYSTEM_PROMPT + contextPart }] },
      { role: 'model', parts: [{ text: 'I understand. I will help you understand your lab results in plain language and suggest you consult your doctor for medical decisions.' }] },
      ...history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ],
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
