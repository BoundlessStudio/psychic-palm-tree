import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import type { Message } from 'ai';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MessageContentPart =
  | string
  | {
      text?: string;
      type?: string;
      payload?: { text?: string; content?: string };
    };

function normaliseMessageContent(message: Message): string {
  const parts: MessageContentPart[] = [];

  if (Array.isArray((message as any).parts)) {
    parts.push(...((message as any).parts as MessageContentPart[]));
  } else if (Array.isArray(message.content)) {
    parts.push(...(message.content as MessageContentPart[]));
  } else if (message.content) {
    parts.push(message.content as MessageContentPart);
  }

  if (!parts.length) {
    return '';
  }

  return parts
    .map((part) => {
      if (typeof part === 'string') return part;
      if (!part) return '';
      if (typeof part.text === 'string') return part.text;
      if (part.payload) {
        if (typeof part.payload === 'string') return part.payload;
        if (typeof part.payload?.text === 'string') return part.payload.text;
        if (typeof part.payload?.content === 'string') return part.payload.content;
      }
      if (typeof (part as any).value === 'string') return (part as any).value;
      return '';
    })
    .join('\n');
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('Missing OPENAI_API_KEY environment variable.', { status: 500 });
  }

  const { messages } = (await req.json()) as { messages: Message[] };

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    stream: true,
    messages: messages.map((message) => ({
      role: message.role as 'user' | 'assistant' | 'system',
      content: normaliseMessageContent(message),
    })),
  });

  const messageId = randomUUID();
  const createdAt = new Date().toISOString();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let accumulatedText = '';

        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content;

          if (!delta) continue;

          const textDelta = Array.isArray(delta)
            ? delta
                .map((part) => {
                  if (!part) return '';
                  if (typeof part === 'string') return part;
                  if ('text' in part && typeof part.text === 'string') return part.text;
                  if ('content' in part && typeof (part as any).content === 'string') {
                    return (part as any).content;
                  }
                  return '';
                })
                .join('')
            : delta;

          if (!textDelta) continue;

          accumulatedText += textDelta;

          const payload = {
            id: messageId,
            role: 'assistant' as const,
            createdAt,
            parts: [
              {
                type: 'text' as const,
                payload: { text: accumulatedText },
              },
            ],
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'message.delta', data: payload })}\n\n`));
        }

        const finalPayload = {
          id: messageId,
          role: 'assistant' as const,
          createdAt,
          parts: [
            {
              type: 'text' as const,
              payload: { text: accumulatedText },
            },
          ],
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'message.end', data: finalPayload })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
