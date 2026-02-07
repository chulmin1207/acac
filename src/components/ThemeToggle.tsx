'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    console.log('ThemeToggle mounted:', { theme, systemTheme, resolvedTheme });
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('Theme changed:', { theme, systemTheme, resolvedTheme });
      // Force check HTML class
      const htmlElement = document.documentElement;
      console.log('HTML classes:', htmlElement.className);
    }
  }, [theme, resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-32 h-12" />
    );
  }

  const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme);
  const isDark = currentTheme === 'dark';

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    console.log('🎨 Theme toggle clicked:', {
      current: theme,
      resolved: resolvedTheme,
      new: newTheme,
      willBeDark: !isDark
    });
    setTheme(newTheme);

    // Force immediate update check
    setTimeout(() => {
      const htmlElement = document.documentElement;
      console.log('After toggle - HTML classes:', htmlElement.className);
      console.log('After toggle - Theme state:', { theme, resolvedTheme });
    }, 100);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={handleToggle}
        className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all hover:scale-105 group flex items-center gap-3 min-w-[140px]"
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
      {/* Debug info - remove after fixing */}
      <div className="text-xs bg-black/80 text-white px-2 py-1 rounded">
        Current: {currentTheme} | Stored: {theme}
      </div>
    </div>
  );
}
