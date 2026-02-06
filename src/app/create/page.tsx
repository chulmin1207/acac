'use client';

import { useStepFlow } from '@/hooks/useStepFlow';
import AuthGuard from '@/components/auth/AuthGuard';
import StepIndicator from '@/components/steps/StepIndicator';
import Step1ServiceSelection from '@/components/steps/Step1ServiceSelection';
import Step2CreativeInput from '@/components/steps/Step2CreativeInput';
import Step3BriefGeneration from '@/components/steps/Step3BriefGeneration';
import Step4ImageGeneration from '@/components/steps/Step4ImageGeneration';
import { Sparkles } from 'lucide-react';

const STEPS = [
  { number: 1 as const, title: '서비스 선택' },
  { number: 2 as const, title: '내용 입력' },
  { number: 3 as const, title: '기획안 생성' },
  { number: 4 as const, title: '이미지 생성' },
  { number: 5 as const, title: '채널 적응' },
  { number: 6 as const, title: '다운로드' },
];

export default function CreatePage() {
  const { currentStep } = useStepFlow();

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ACAC
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              AI Creative Automation Center
            </p>
          </header>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={STEPS} />

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {currentStep === 1 && <Step1ServiceSelection />}
            {currentStep === 2 && <Step2CreativeInput />}
            {currentStep === 3 && <Step3BriefGeneration />}
            {currentStep === 4 && <Step4ImageGeneration />}
            {currentStep === 5 && (
              <div className="text-center py-20 text-gray-500">
                Step 5: 채널 적응 (Phase 3에서 구현)
              </div>
            )}
            {currentStep === 6 && (
              <div className="text-center py-20 text-gray-500">
                Step 6: 다운로드 (Phase 3에서 구현)
              </div>
            )}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
