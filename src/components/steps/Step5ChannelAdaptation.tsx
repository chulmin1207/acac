'use client';

import { useState, useEffect } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import { Loader2, CheckCircle2, Radio } from 'lucide-react';
import type { Channel } from '@/types';

export default function Step5ChannelAdaptation() {
  const {
    selectedService,
    userInput,
    referenceImageUrls,
    brief,
    selectedImage,
    selectedChannelIds,
    toggleChannelId,
    setCreative,
    nextStep,
    prevStep,
  } = useStepFlow();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChannel, setCurrentChannel] = useState<string>('');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data.filter((c: Channel) => c.isActive));
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || selectedChannelIds.length === 0) {
      alert('이미지와 채널을 선택해주세요.');
      return;
    }

    setGenerating(true);
    setProgress(0);

    try {
      // Simulate progress for each channel
      const totalChannels = selectedChannelIds.length;

      for (let i = 0; i < totalChannels; i++) {
        setCurrentChannel(channels.find(c => c.id === selectedChannelIds[i])?.name || '');
        setProgress(((i + 1) / totalChannels) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Call API to adapt creative
      const response = await fetch('/api/creative/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          briefId: brief?.id,
          userInput,
          referenceImages: referenceImageUrls,
          baseImage: selectedImage,
          channelIds: selectedChannelIds,
        }),
      });

      if (!response.ok) throw new Error('Adaptation failed');

      const data = await response.json();
      setCreative(data.creative);

      // Auto-advance to next step
      setTimeout(() => {
        nextStep();
      }, 1000);
    } catch (error) {
      console.error('Channel adaptation error:', error);
      alert('채널 적응에 실패했습니다.');
    } finally {
      setGenerating(false);
      setProgress(0);
      setCurrentChannel('');
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
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          채널별 광고 소재 제작
        </h2>
        <p className="text-gray-600">
          선택한 이미지를 각 채널에 최적화된 사이즈로 제작합니다
        </p>
      </div>

      {!generating ? (
        <>
          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 text-blue-900">
                선택된 베이스 이미지
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {selectedImage.variant}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">버전:</span> {selectedImage.variant}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    이 이미지를 기반으로 각 채널에 맞게 재구성합니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Channel Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              제작할 채널 선택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => toggleChannelId(channel.id)}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left
                    ${
                      selectedChannelIds.includes(channel.id)
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Radio className={`w-6 h-6 ${selectedChannelIds.includes(channel.id) ? 'text-blue-600' : 'text-gray-400'}`} />
                      <h4 className="font-bold text-lg text-gray-900">
                        {channel.name}
                      </h4>
                    </div>
                    {selectedChannelIds.includes(channel.id) && (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="ml-9">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">플랫폼:</span> {channel.platform}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">사이즈:</span> {channel.sizes.length}개
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {channel.sizes.map((size, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {size.width}×{size.height}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={selectedChannelIds.length === 0}
              className={`
                inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all
                ${
                  selectedChannelIds.length > 0
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Radio className="w-6 h-6" />
              광고 소재 제작 시작
              {selectedChannelIds.length > 0 && (
                <span className="text-sm opacity-90">
                  ({selectedChannelIds.length}개 채널)
                </span>
              )}
            </button>
          </div>
        </>
      ) : (
        /* Progress Display */
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            광고 소재 제작 중...
          </h3>
          {currentChannel && (
            <p className="text-gray-600 mb-6">
              현재 작업 중: <span className="font-semibold">{currentChannel}</span>
            </p>
          )}

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-green-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(progress)}% 완료
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!generating && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            이전 단계
          </button>

          <button
            onClick={nextStep}
            disabled={selectedChannelIds.length === 0}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all
              ${
                selectedChannelIds.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            건너뛰기
          </button>
        </div>
      )}
    </div>
  );
}
