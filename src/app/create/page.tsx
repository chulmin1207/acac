'use client';

import { useStepFlow } from '@/hooks/useStepFlow';
import AuthGuard from '@/components/auth/AuthGuard';
import StepIndicator from '@/components/steps/StepIndicator';
import Step1ServiceSelection from '@/components/steps/Step1ServiceSelection';
import Step2CreativeInput from '@/components/steps/Step2CreativeInput';
import Step3BriefGeneration from '@/components/steps/Step3BriefGeneration';
import Step4ImageGeneration from '@/components/steps/Step4ImageGeneration';
import Step5ChannelAdaptation from '@/components/steps/Step5ChannelAdaptation';
import Step6ResultDownload from '@/components/steps/Step6ResultDownload';
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ACAC
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI Creative Automation Center
            </p>
          </header>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={STEPS} />

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-colors">
            {currentStep === 1 && <Step1ServiceSelection />}
            {currentStep === 2 && <Step2CreativeInput />}
            {currentStep === 3 && <Step3BriefGeneration />}
            {currentStep === 4 && <Step4ImageGeneration />}
            {currentStep === 5 && <Step5ChannelAdaptation />}
            {currentStep === 6 && <Step6ResultDownload />}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
