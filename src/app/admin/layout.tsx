'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { Settings, Package, Radio } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '대시보드', icon: Settings },
    { href: '/admin/services', label: '서비스 관리', icon: Package },
    { href: '/admin/channels', label: '채널 관리', icon: Radio },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                ACAC Admin
              </h1>
              <Link
                href="/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                크리에이티브 생성
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <nav className="bg-white rounded-lg shadow-sm p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
