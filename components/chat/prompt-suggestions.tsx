'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

const suggestions = [
  'Summarize the key takeaways from the latest research report.',
  'Draft a friendly onboarding email for a new teammate.',
  'Brainstorm product taglines focused on sustainability.',
];

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function PromptSuggestions({ onSelect, disabled }: PromptSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="secondary"
          size="sm"
          className="max-w-full text-left whitespace-normal"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
