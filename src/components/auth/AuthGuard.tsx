'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if we're on localhost (development mode)
  const isDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useEffect(() => {
    // Skip auth check in development
    if (isDevelopment) return;

    if (status === 'loading') return;

    if (!session) {
      router.push('/');
    }
  }, [session, status, router, isDevelopment]);

  // Show loading spinner only in production
  if (!isDevelopment && status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  // In production, require session
  if (!isDevelopment && !session) {
    return null;
  }

  // Show dev mode banner on localhost
  return (
    <>
      {isDevelopment && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 p-4">
          <p className="font-bold">🔧 개발 모드</p>
          <p className="text-sm">OAuth 미설정 상태입니다. localhost에서 인증 없이 테스트 가능합니다.</p>
        </div>
      )}
      {children}
    </>
  );
}
