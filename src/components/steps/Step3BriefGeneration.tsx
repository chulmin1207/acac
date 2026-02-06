'use client';

import { useState } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import { Loader2, Sparkles, Edit2, Save } from 'lucide-react';

export default function Step3BriefGeneration() {
  const {
    selectedService,
    userInput,
    referenceAnalysis,
    brief,
    setBrief,
    nextStep,
    prevStep,
  } = useStepFlow();

  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState(brief);

  const handleGenerate = async () => {
    if (!selectedService) {
      alert('서비스를 먼저 선택해주세요.');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          userInput,
          referenceAnalysis,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setBrief(data.brief);
      setEditedBrief(data.brief);
    } catch (error) {
      console.error('Brief generation error:', error);
      alert('기획안 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!brief || !editedBrief) return;

    try {
      const response = await fetch('/api/brief/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          updates: editedBrief,
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      const data = await response.json();
      setBrief(data.brief);
      setEditing(false);
    } catch (error) {
      console.error('Brief update error:', error);
      alert('기획안 수정에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          기획안 생성
        </h2>
        <p className="text-gray-600">
          AI가 자동으로 광고 기획안을 생성합니다
        </p>
      </div>

      {!brief ? (
        <div className="text-center py-12">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`
              inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all
              ${
                generating
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
              }
            `}
          >
            {generating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                기획안 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                기획안 생성하기
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Claude AI가 최적의 광고 기획안을 작성합니다
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              생성된 기획안
            </h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                수정하기
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                저장하기
              </button>
            )}
          </div>

          {/* Brief Content */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
            {/* Headline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                헤드카피
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editedBrief?.headline || ''}
                  onChange={(e) =>
                    setEditedBrief({
                      ...editedBrief!,
                      headline: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {brief.headline}
                </p>
              )}
            </div>

            {/* Sub-headline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                서브카피
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editedBrief?.subHeadline || ''}
                  onChange={(e) =>
                    setEditedBrief({
                      ...editedBrief!,
                      subHeadline: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              ) : (
                <p className="text-lg text-gray-700">{brief.subHeadline}</p>
              )}
            </div>

            {/* Key Messages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                핵심 소구 포인트 (3개)
              </label>
              <div className="space-y-2">
                {editing
                  ? editedBrief?.keyMessages.map((msg, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={msg}
                        onChange={(e) => {
                          const newMessages = [...(editedBrief?.keyMessages || [])];
                          newMessages[idx] = e.target.value;
                          setEditedBrief({
                            ...editedBrief!,
                            keyMessages: newMessages,
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))
                  : brief.keyMessages.map((msg, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700">{msg}</p>
                      </div>
                    ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                행동 유도 문구 (CTA)
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editedBrief?.cta || ''}
                  onChange={(e) =>
                    setEditedBrief({
                      ...editedBrief!,
                      cta: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 font-semibold">{brief.cta}</p>
              )}
            </div>

            {/* Visual Direction */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비주얼 방향성
              </label>
              {editing ? (
                <textarea
                  value={editedBrief?.visualDirection || ''}
                  onChange={(e) =>
                    setEditedBrief({
                      ...editedBrief!,
                      visualDirection: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-700">{brief.visualDirection}</p>
              )}
            </div>

            {/* Tone and Manner */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                톤앤매너
              </label>
              {editing ? (
                <textarea
                  value={editedBrief?.toneAndManner || ''}
                  onChange={(e) =>
                    setEditedBrief({
                      ...editedBrief!,
                      toneAndManner: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-700">{brief.toneAndManner}</p>
              )}
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '생성 중...' : '새로운 기획안 생성'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          이전 단계
        </button>

        <button
          onClick={nextStep}
          disabled={!brief}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              brief
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
}
