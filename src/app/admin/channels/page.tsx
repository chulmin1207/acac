'use client';

import { useEffect, useState } from 'react';
import type { Channel } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/channels/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchChannels();
      }
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">채널 관리</h2>
          <p className="text-gray-600">광고를 게재할 채널을 관리합니다</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => alert('채널 추가 기능은 곧 추가됩니다')}
        >
          <Plus className="w-5 h-5" />
          채널 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {channel.name}
                </h3>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {channel.platform}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => alert('편집 기능은 곧 추가됩니다')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(channel.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                사이즈 ({channel.sizes.length})
              </h4>
              <div className="space-y-2">
                {channel.sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                  >
                    <span className="text-gray-700">{size.label}</span>
                    <span className="text-gray-500">
                      {size.width} × {size.height}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">상태</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    channel.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {channel.isActive ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
