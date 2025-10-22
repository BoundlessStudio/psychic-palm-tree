import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import type { Message } from 'ai';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  if (!process.env.OPENAI_API_KEY) {
    return new Response('Missing OPENAI_API_KEY environment variable.', { status: 500 });
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: messages.map((message) => ({
      role: message.role as 'user' | 'assistant' | 'system',
      content: Array.isArray(message.content)
        ? message.content
            .map((part) => {
              if (typeof part === 'string') return part;
              if ('text' in part) return part.text;
              return '';
            })
            .join('\n')
        : message.content,
    })),
  });

  const answer = completion.choices[0]?.message?.content ?? '';

  return Response.json({
    message: {
      id: randomUUID(),
      role: 'assistant',
      content: answer,
    },
  });
}
