'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9', className)}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Sun className={cn('h-5 w-5 transition-all', isDark && 'rotate-90 scale-0')} />
      <Moon className={cn('absolute h-5 w-5 transition-all', !isDark && '-rotate-90 scale-0')} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
