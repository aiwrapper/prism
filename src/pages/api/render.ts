// src/pages/api/render.ts
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
    // Call the OpenAI API to fix the identified flaws
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are an expert editor. Your task is to rewrite the following article, incorporating all necessary corrections based on the provided analysis. Ensure that the revised article is coherent, well-structured, and free of any identified issues.
            `
          },
          {
            role: 'user',
            content: `
Based on the analysis provided, please rewrite the following article to correct all identified reasoning flaws, inaccuracies, grammatical errors, and stylistic issues. The revised article should be clear, accurate, and well-written.

Original Article:
${text}
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

    console.log('Render API Response:', JSON.stringify(response.data, null, 2)); // Log the full API response

    // Remove "Revised Article:" if it appears in the response
    let fixed = response.data.choices[0].message.content;
    fixed = fixed.replace(/^Revised Article:\s*/, '');

    res.status(200).json({ fixed });
  } catch (error) {
    console.error('Error rendering text:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to render text', details: error.response ? error.response.data : error.message });
  }
}
