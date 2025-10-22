import * as React from 'react';
import type { Message } from 'ai';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
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
            {(() => {
              const content =
                typeof message.content === 'string'
                  ? message.content
                  : message.content
                      .map((part) => {
                        if (typeof part === 'string') return part;
                        if ('text' in part) return part.text;
                        return '';
                      })
                      .join('\n');

              return content.split('\n').map((line, index) => <p key={index}>{line}</p>);
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
