'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Service, Channel } from '@/types';
import { Package, Radio, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    channels: 0,
    activeServices: 0,
    activeChannels: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, channelsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/channels'),
      ]);

      if (servicesRes.ok && channelsRes.ok) {
        const services: Service[] = await servicesRes.json();
        const channels: Channel[] = await channelsRes.json();

        setStats({
          services: services.length,
          channels: channels.length,
          activeServices: services.filter((s) => s.isActive).length,
          activeChannels: channels.filter((c) => c.isActive).length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statCards = [
    {
      title: '전체 서비스',
      value: stats.services,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: '활성 서비스',
      value: stats.activeServices,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: '전체 채널',
      value: stats.channels,
      icon: Radio,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: '활성 채널',
      value: stats.activeChannels,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
        <p className="text-gray-600">시스템 현황을 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/services"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">서비스 관리</h4>
            <p className="text-sm text-gray-600">
              서비스 추가, 수정, 삭제
            </p>
          </Link>

          <Link
            href="/admin/channels"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <Radio className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">채널 관리</h4>
            <p className="text-sm text-gray-600">
              채널 추가, 수정, 삭제
            </p>
          </Link>

          <Link
            href="/create"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">크리에이티브 생성</h4>
            <p className="text-sm text-gray-600">
              AI 기반 광고 소재 생성
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
