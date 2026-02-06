'use client';

import { useState } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import { Download, Package } from 'lucide-react';
import type { ChannelCreative } from '@/types';

export default function Step6ResultDownload() {
  const { creative, prevStep, reset } = useStepFlow();
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);

  if (!creative) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">생성된 소재가 없습니다.</p>
      </div>
    );
  }

  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(`/api/creative/download?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      const response = await fetch(`/api/creative/download-zip?creativeId=${creative.id}`);
      if (!response.ok) throw new Error('ZIP download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creative-${creative.id}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('ZIP download error:', error);
      alert('전체 다운로드에 실패했습니다.');
    } finally {
      setDownloadingAll(false);
    }
  };

  const activeChannel = creative.channelCreatives[activeChannelIndex];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          광고 소재 제작 완료
        </h2>
        <p className="text-gray-600">
          채널별로 최적화된 광고 소재를 다운로드하세요
        </p>
      </div>

      {/* Channel Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {creative.channelCreatives.map((channel, index) => (
              <button
                key={channel.channelId}
                onClick={() => setActiveChannelIndex(index)}
                className={`
                  px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition-colors
                  ${
                    activeChannelIndex === index
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {channel.channelName}
                <span className="ml-2 text-sm opacity-75">
                  ({channel.images.length}개)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Channel Content */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {activeChannel.channelName} - {activeChannel.images.length}개 사이즈
          </h3>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChannel.images.map((image, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                <div
                  className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  style={{
                    aspectRatio: `${image.width}/${image.height}`,
                    minHeight: '200px',
                  }}
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-400 mb-2">
                      {image.size}
                    </p>
                    <p className="text-sm text-gray-500">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <div className="p-4">
                  <button
                    onClick={() =>
                      handleDownloadImage(
                        image.url,
                        `${activeChannel.channelName}_${image.size}_${image.width}x${image.height}.png`
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download All Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleDownloadAll}
          disabled={downloadingAll}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-6 h-6" />
          {downloadingAll ? '다운로드 중...' : '전체 다운로드 (ZIP)'}
        </button>
      </div>

      {/* Summary Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <h4 className="font-bold text-lg text-blue-900 mb-3">생성 요약</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {creative.channelCreatives.length}
            </p>
            <p className="text-sm text-gray-700">채널</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {creative.channelCreatives.reduce(
                (sum, ch) => sum + ch.images.length,
                0
              )}
            </p>
            <p className="text-sm text-gray-700">총 이미지</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {new Date(creative.createdAt).toLocaleDateString('ko-KR')}
            </p>
            <p className="text-sm text-gray-700">생성일</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{creative.status}</p>
            <p className="text-sm text-gray-700">상태</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          이전 단계
        </button>

        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          새 소재 만들기
        </button>
      </div>
    </div>
  );
}
