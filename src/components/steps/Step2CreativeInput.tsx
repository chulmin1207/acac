'use client';

import { useState } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';

export default function Step2CreativeInput() {
  const {
    userInput,
    setUserInput,
    referenceImages,
    referenceImageUrls,
    addReferenceImage,
    removeReferenceImage,
    setReferenceImageUrls,
    setReferenceAnalysis,
    nextStep,
  } = useStepFlow();

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
        addReferenceImage(file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setReferenceImageUrls(data.files.map((f: any) => f.url));
    } catch (error) {
      console.error('Upload error:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (referenceImageUrls.length === 0 || !userInput.trim()) {
      alert('텍스트 입력과 레퍼런스 이미지를 모두 제공해주세요.');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analysis/reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: referenceImageUrls,
          userInput,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setReferenceAnalysis(data.analysis);
      setAnalyzed(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('레퍼런스 분석에 실패했습니다.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          크리에이티브 내용 입력
        </h2>
        <p className="text-gray-600">
          광고 소재에 대한 설명과 레퍼런스 이미지를 제공해주세요
        </p>
      </div>

      {/* Text Input */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          광고 소재 설명
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="예: 야식 배달 프로모션, 늦은 밤에도 빠르게 배달되는 서비스 강조"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          레퍼런스 이미지 (최대 5개)
        </label>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">
            클릭하여 이미지 업로드
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, WebP (최대 10MB)
          </p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            max={5}
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>

        {/* Uploaded Images Preview */}
        {referenceImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {referenceImages.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Reference ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeReferenceImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleAnalyze}
          disabled={analyzing || uploading || !userInput.trim() || referenceImageUrls.length === 0}
          className={`
            flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              analyzing || uploading || !userInput.trim() || referenceImageUrls.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
            }
          `}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              레퍼런스 분석 중...
            </>
          ) : analyzed ? (
            <>
              <CheckCircle className="w-5 h-5" />
              분석 완료
            </>
          ) : (
            '레퍼런스 분석'
          )}
        </button>

        {analyzed && (
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            {showAnalysis ? '분석 결과 숨기기' : '분석 결과 보기'}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analyzed && showAnalysis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 text-purple-900">
            레퍼런스 분석 결과
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">텍스트 배치:</span> {useStepFlow.getState().referenceAnalysis?.textPlacement}</p>
            <p><span className="font-semibold">오브제 위치:</span> {useStepFlow.getState().referenceAnalysis?.objectPositions}</p>
            <p><span className="font-semibold">레이아웃:</span> {useStepFlow.getState().referenceAnalysis?.layout}</p>
            <p><span className="font-semibold">톤앤매너:</span> {useStepFlow.getState().referenceAnalysis?.toneAndManner}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => useStepFlow.getState().prevStep()}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          이전 단계
        </button>

        <button
          onClick={nextStep}
          disabled={!analyzed}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              analyzed
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
