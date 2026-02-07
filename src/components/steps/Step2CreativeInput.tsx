'use client';

import { useState, useRef, useEffect } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import { Upload, X, Loader2, CheckCircle, Clipboard } from 'lucide-react';

export default function Step2CreativeInput() {
  const {
    selectedService,
    userInput,
    setUserInput,
    referenceImages,
    referenceImageUrls,
    addReferenceImage,
    removeReferenceImage,
    setReferenceImageUrls,
    setReferenceAnalysis,
    nextStep,
    prevStep,
  } = useStepFlow();

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPasteActive, setIsPasteActive] = useState(false);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  // Service-specific placeholders
  const placeholders: Record<string, string> = {
    snack24: '예: 신규 고객 유치 프로모션, 5,000가지 간식 중 자유 선택, 탕비실 분위기 강조',
    breakfast24: '예: 새벽 배송 조식 서비스, 출근이 기대되는 아침, 신선함과 편리함 강조',
    coffee24: '예: 커피머신 렌탈 프로모션, 한 잔 198원의 가성비, 사무실 카페 분위기',
    birthday24: '예: 직원 생일 자동 관리 서비스, 원하는 선물 직접 선택, 감동의 순간 강조',
  };

  const placeholder = selectedService
    ? placeholders[selectedService.id] || '광고 소재에 대한 설명을 입력하세요'
    : '먼저 서비스를 선택해주세요';

  // Handle paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        setIsPasteActive(true);
        setTimeout(() => setIsPasteActive(false), 600);
        const fileList = createFileList(imageFiles);
        handleFileUpload(fileList);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Create FileList from File array
  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
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
          placeholder={placeholder}
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
          ref={uploadAreaRef}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${
              isDragActive || isPasteActive
                ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg ring-4 ring-blue-200 animate-pulse'
                : uploading
                ? 'border-green-400 bg-green-50 animate-pulse'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
          onClick={() => document.getElementById('file-input')?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-green-500 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-green-600 font-semibold">
                업로드 중...
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <Upload
                  className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                    isDragActive || isPasteActive ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                {isPasteActive && (
                  <Clipboard className="w-6 h-6 text-blue-500 absolute top-0 right-1/2 transform translate-x-12 -translate-y-2 animate-bounce" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                클릭 또는 드래그하여 이미지 업로드
              </p>
              <p className="text-xs text-gray-400 mb-2">
                PNG, JPG, WebP (최대 10MB)
              </p>
              <p className="text-xs text-blue-500 font-semibold flex items-center justify-center gap-1">
                <Clipboard className="w-3 h-3" />
                이미지 복사 후 Ctrl+V (붙여넣기)로도 업로드 가능
              </p>
            </>
          )}
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
                  className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReferenceImage(idx);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {idx + 1}
                </div>
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
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            레퍼런스 분석 결과
          </h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(analyzed, null, 2)}
          </pre>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          이전 단계
        </button>

        <button
          onClick={nextStep}
          disabled={!userInput.trim()}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              userInput.trim()
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
