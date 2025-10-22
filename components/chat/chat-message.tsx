import * as React from 'react';
import type { Message } from 'ai';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

function extractTextFromMessage(message: Message): string {
  const candidateParts = (message as any).parts as
    | Array<
        | string
        | {
            type?: string;
            text?: string;
            payload?: unknown;
          }
        | { text?: string }
      >
    | undefined;

  if (candidateParts && Array.isArray(candidateParts) && candidateParts.length > 0) {
    return candidateParts
      .map((part) => {
        if (!part) return '';
        if (typeof part === 'string') return part;
        if (typeof (part as any).text === 'string') return (part as any).text;

        const payload = (part as any).payload;
        if (typeof payload === 'string') return payload;
        if (payload && typeof (payload as any).text === 'string') return (payload as any).text;
        if (payload && typeof (payload as any).content === 'string') return (payload as any).content;

        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (!part) return '';
        if (typeof part === 'string') return part;
        if ('text' in part && typeof part.text === 'string') return part.text;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const text = React.useMemo(() => extractTextFromMessage(message), [message]);
  return (
    <div className={cn('flex gap-3 rounded-lg px-4 py-3 transition-colors', isUser ? 'justify-end bg-primary/5' : 'bg-muted')}
    >
      <div className={cn('flex w-full items-start gap-3', isUser && 'flex-row-reverse text-right')}>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow',
            isUser ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'
          )}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="text-xs font-medium text-muted-foreground">
            {isUser ? 'You' : message.role === 'assistant' ? 'Assistant' : 'System'}
          </p>
          <div className="whitespace-pre-wrap text-foreground">
            {text.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
