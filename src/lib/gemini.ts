import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function processVoiceCommand(transcript: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are a coding assistant. Analyze this voice command and respond with a JSON object containing:
1. "intent": A brief description of what the user wants to do
2. "code": The generated code (if applicable)
3. "explanation": A clear explanation of the code and what it does
4. "language": The programming language (javascript, python, html, css, etc.)

Voice command: "${transcript}"

Respond ONLY with valid JSON. If the command is not code-related, generate appropriate content or politely explain limitations.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      intent: 'Parse response',
      code: '',
      explanation: text,
      language: 'javascript'
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      intent: 'Error processing command',
      code: '',
      explanation: 'Failed to process the command. Please check your API key and try again.',
      language: 'javascript'
    };
  }
}

export async function explainCode(code: string, language: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Explain this ${language} code in simple terms for someone learning to code. Be clear and concise:

${code}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Failed to generate explanation.';
  }
}
