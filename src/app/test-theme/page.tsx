'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function TestThemePage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Theme Test Page
      </h1>

      {/* Theme Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Theme State:</h2>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm text-gray-900 dark:text-white">
          {JSON.stringify({ theme, resolvedTheme, systemTheme }, null, 2)}
        </pre>
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        <button
          onClick={() => setTheme('light')}
          className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
        >
          Set Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="ml-4 px-6 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg hover:bg-gray-800 font-semibold"
        >
          Set Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className="ml-4 px-6 py-3 bg-blue-600 text-white border-2 border-blue-700 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Set System
        </button>
      </div>

      {/* Visual Test Boxes */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <h3 className="font-bold text-gray-900 dark:text-white">Light background</h3>
          <p className="text-gray-600 dark:text-gray-400">This should be white in light mode, dark in dark mode</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <h3 className="font-bold text-gray-900 dark:text-white">Gray background</h3>
          <p className="text-gray-600 dark:text-gray-400">This should be light gray in light mode, very dark in dark mode</p>
        </div>
      </div>

      {/* HTML Class Check */}
      <div className="mt-8 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
        <p className="text-yellow-900 dark:text-yellow-100 font-semibold">
          Check browser console for HTML class and localStorage
        </p>
        <button
          onClick={() => {
            console.log('HTML element classes:', document.documentElement.className);
            console.log('localStorage theme:', localStorage.getItem('acac-theme'));
            console.log('All localStorage:', { ...localStorage });
          }}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Log Debug Info
        </button>
      </div>
    </div>
  );
}
