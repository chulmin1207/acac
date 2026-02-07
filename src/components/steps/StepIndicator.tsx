'use client';

import { Check } from 'lucide-react';
import type { StepNumber } from '@/hooks/useStepFlow';

interface StepIndicatorProps {
  currentStep: StepNumber;
  steps: {
    number: StepNumber;
    title: string;
  }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-6 transition-colors">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                  ${
                    currentStep > step.number
                      ? 'bg-green-500 dark:bg-green-600 text-white'
                      : currentStep === step.number
                      ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Title */}
              <span
                className={`
                  text-xs mt-2 font-medium text-center
                  ${
                    currentStep >= step.number
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-500'
                  }
                `}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-colors
                  ${currentStep > step.number ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
