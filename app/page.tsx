'use client';

import * as React from 'react';
import { useChat } from 'ai/react';
import type { Message } from 'ai';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import { PromptSuggestions } from '@/components/chat/prompt-suggestions';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ChatPage() {
  const { messages, input, handleInputChange, isLoading, setInput, append, setMessages } = useChat({
    api: '/api/chat',
  });

  const hasMessages = messages.length > 0;

  const sendPrompt = React.useCallback(() => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      parts: [
        {
          type: 'text',
          payload: { text: input },
        },
      ],
    };

    append(userMessage);
    setInput('');
  }, [append, input, setInput]);

  return (
    <main className="container flex min-h-screen flex-col py-10">
      <header className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Studio</h1>
              <p className="text-sm text-muted-foreground">
                Experiment with prompts in a polished, shadcn-inspired chat interface.
              </p>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Responses stream in real-time from the OpenAI API.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setMessages([
                  {
                    id: crypto.randomUUID(),
                    role: 'system',
                    content: 'You are a helpful assistant.',
                    parts: [
                      {
                        type: 'text',
                        payload: { text: 'You are a helpful assistant.' },
                      },
                    ],
                  } satisfies Message,
                ])
              }
            >
              Reset tone
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {hasMessages ? (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground">
                  <Sparkles className="h-8 w-8" />
                  <div>
                    <p className="font-medium text-foreground">Start the conversation</p>
                    <p>Ask for copy ideas, summaries, or technical guidance.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t bg-muted/50 p-6">
              <ChatInput
                value={input}
                onChange={handleInputChange}
                onSubmit={sendPrompt}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Prompt Library</CardTitle>
            <CardDescription>Inject a prebuilt prompt to speed up exploration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PromptSuggestions
              disabled={isLoading}
              onSelect={(prompt) => {
                setInput(prompt);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={sendPrompt}
              disabled={isLoading || !input.trim()}
            >
              Send current prompt
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
