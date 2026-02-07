'use client';

import { useEffect } from 'react';

export default function SimpleTest() {
  useEffect(() => {
    // Force add dark class to HTML element
    document.documentElement.classList.add('dark');
    console.log('Added dark class to HTML');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-black dark:text-white">다크 모드 테스트</span>
      </h1>

      <div className="space-y-6">
        {/* Test Box 1 */}
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">
            박스 1: 라이트 모드에서 연한 회색, 다크 모드에서 진한 회색
          </p>
        </div>

        {/* Test Box 2 */}
        <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-blue-900 dark:text-blue-100 font-bold text-lg">
            박스 2: 라이트 모드에서 연한 파랑, 다크 모드에서 진한 파랑
          </p>
        </div>

        {/* Test Box 3 - Most obvious */}
        <div className="p-6 bg-red-500 dark:bg-green-500 rounded-lg">
          <p className="text-white font-bold text-xl">
            ⭐ 박스 3: 라이트=빨강, 다크=초록 (가장 명확함!)
          </p>
        </div>

        {/* Test Box 4 - Border test */}
        <div className="p-6 border-8 border-black dark:border-white rounded-lg bg-gray-50 dark:bg-gray-900">
          <p className="text-black dark:text-white font-bold text-lg">
            박스 4: 테두리가 라이트=검정, 다크=흰색
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <h2 className="text-yellow-900 dark:text-yellow-100 font-bold text-xl mb-4">
          📌 확인 방법:
        </h2>
        <ul className="space-y-2 text-yellow-900 dark:text-yellow-100">
          <li>✅ 박스 3이 <strong className="text-green-600 dark:text-green-400">초록색</strong>이면 = 다크 모드 작동!</li>
          <li>❌ 박스 3이 <strong className="text-red-600 dark:text-red-400">빨간색</strong>이면 = Tailwind 설정 문제</li>
          <li>📝 페이지가 로드되면 자동으로 HTML에 'dark' 클래스가 추가됩니다</li>
        </ul>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-black text-white rounded-lg font-mono text-sm">
        <p>Debug: 이 텍스트가 보이면 페이지가 로드된 것입니다.</p>
        <p>F12를 눌러 콘솔에서 "Added dark class to HTML" 메시지를 확인하세요.</p>
      </div>
    </div>
  );
}
