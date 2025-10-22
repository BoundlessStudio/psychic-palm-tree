'use client';

import * as React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim()) return;
        onSubmit();
      }}
      className="relative space-y-3"
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder="Ask the assistant anything…"
        className={cn('min-h-[120px] resize-none pr-14', isLoading && 'opacity-75')}
        disabled={disabled || isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute bottom-3 right-3 h-9 w-9 rounded-full shadow-sm"
        disabled={disabled || isLoading || !value.trim()}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
