'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-32 h-12" />
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => {
        const newTheme = isDark ? 'light' : 'dark';
        console.log('Theme toggle clicked:', { current: theme, new: newTheme });
        setTheme(newTheme);
      }}
      className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all hover:scale-105 group flex items-center gap-3 min-w-[140px]"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Light Mode
          </span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-600 group-hover:-rotate-12 transition-transform duration-300 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Dark Mode
          </span>
        </>
      )}
    </button>
  );
}
