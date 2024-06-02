// src/pages/api/analyze.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const maxTokens = process.env.OPENAI_MAX_TOKENS || 200;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `  
You are an expert analyst and fact-checker. Your task is to meticulously review the following article for any reasoning flaws, inaccuracies, grammatical errors, and stylistic issues. Provide detailed feedback on each of these aspects, specifying the exact location and nature of each error. For any inaccuracies, provide the correct information and link to a reliable source. Structure your feedback clearly and concisely.
            `
          },
          {
            role: 'user',
            content: `
Please analyze the following text for reasoning flaws, inaccuracies, grammatical errors, and stylistic issues:

${text}

1. **Reasoning Flaws**: Identify any logical fallacies, weak arguments, or unsupported claims.
2. **Inaccuracies**: Spot any factual errors or misleading statements. Provide the correct information and a link to a reliable source.
3. **Grammatical Errors**: Highlight grammatical mistakes and suggest corrections.
4. **Stylistic Issues**: Point out any issues with style, tone, or clarity, and suggest improvements.

Please structure your response as follows:
- **Reasoning Flaws**:
  1. [Description of the flaw] - [Excerpt from the text]
- **Inaccuracies**:
  1. [Description of the inaccuracy] - [Excerpt from the text] - [Correct information with source link]
- **Grammatical Errors**:
  1. [Description of the error] - [Excerpt from the text] - [Suggested correction]
- **Stylistic Issues**:
  1. [Description of the issue] - [Excerpt from the text] - [Suggested improvement]
            `
          }
        ],
        max_tokens: parseInt(maxTokens, 10),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', JSON.stringify(response.data, null, 2)); // Log the full API response

    const analysis = response.data.choices[0].message.content.replace(/\n/g, '<br/>'); // Ensure paragraphs are split

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error analyzing text:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to analyze text', details: error.response ? error.response.data : error.message });
  }
}
