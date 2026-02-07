'use client';

import { useEffect, useState } from 'react';

export default function DebugThemePage() {
  const [htmlClasses, setHtmlClasses] = useState('');
  const [localStorageTheme, setLocalStorageTheme] = useState('');
  const [allLocalStorage, setAllLocalStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check HTML classes
    setHtmlClasses(document.documentElement.className);

    // Check localStorage
    const theme = localStorage.getItem('acac-theme') || 'none';
    setLocalStorageTheme(theme);

    // Get all localStorage
    const storage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        storage[key] = localStorage.getItem(key) || '';
      }
    }
    setAllLocalStorage(storage);

    console.log('=== THEME DEBUG INFO ===');
    console.log('HTML classes:', document.documentElement.className);
    console.log('localStorage acac-theme:', theme);
    console.log('All localStorage:', storage);
  }, []);

  const testDarkClass = () => {
    // Manually add/remove dark class to test
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      console.log('Removed dark class');
    } else {
      html.classList.add('dark');
      console.log('Added dark class');
    }
    setHtmlClasses(html.className);
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        다크모드 디버그 페이지
      </h1>

      {/* HTML Classes Check */}
      <div className="mb-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          2번 체크: HTML Classes
        </h2>
        <div className="bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700">
          <p className="font-mono text-sm text-gray-900 dark:text-white">
            {htmlClasses || '(비어있음)'}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {htmlClasses.includes('dark') ? '✅ "dark" 클래스 있음' : '❌ "dark" 클래스 없음'}
        </p>
      </div>

      {/* localStorage Check */}
      <div className="mb-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          3번 체크: localStorage
        </h2>
        <div className="bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700">
          <p className="font-mono text-sm text-gray-900 dark:text-white">
            acac-theme: {localStorageTheme}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {localStorageTheme !== 'none' ? '✅ 저장된 테마 있음' : '❌ 저장된 테마 없음'}
        </p>

        <div className="mt-4 bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700">
          <p className="font-bold text-sm mb-2 text-gray-900 dark:text-white">전체 localStorage:</p>
          <pre className="text-xs text-gray-900 dark:text-white overflow-auto">
            {JSON.stringify(allLocalStorage, null, 2)}
          </pre>
        </div>
      </div>

      {/* Manual Dark Class Test */}
      <div className="mb-6 p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
        <h2 className="text-xl font-bold mb-3 text-yellow-900 dark:text-yellow-100">
          수동 테스트
        </h2>
        <button
          onClick={testDarkClass}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
        >
          Dark 클래스 토글 (수동)
        </button>
        <p className="mt-2 text-sm text-yellow-900 dark:text-yellow-100">
          이 버튼으로 배경이 바뀌면 → Tailwind는 정상, next-themes가 문제
        </p>
      </div>

      {/* Visual Test */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <h3 className="font-bold text-gray-900 dark:text-white">라이트 모드</h3>
          <p className="text-gray-600 dark:text-gray-400">흰색 배경이어야 함</p>
        </div>
        <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <h3 className="font-bold text-gray-900 dark:text-white">다크 모드</h3>
          <p className="text-gray-600 dark:text-gray-400">회색 배경이어야 함</p>
        </div>
      </div>
    </div>
  );
}
