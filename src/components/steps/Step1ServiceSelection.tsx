'use client';

import { useEffect, useState } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';
import type { Service } from '@/types';
import { Sparkles } from 'lucide-react';

// Service icon mapping
const serviceIcons: Record<string, { emoji: string; bgColor: string; bgColorDark: string }> = {
  snack24: { emoji: '🍪', bgColor: 'bg-orange-100', bgColorDark: 'dark:bg-orange-900/30' },
  breakfast24: { emoji: '🥗', bgColor: 'bg-green-100', bgColorDark: 'dark:bg-green-900/30' },
  coffee24: { emoji: '☕', bgColor: 'bg-amber-100', bgColorDark: 'dark:bg-amber-900/30' },
  birthday24: { emoji: '🎁', bgColor: 'bg-pink-100', bgColorDark: 'dark:bg-pink-900/30' },
};

export default function Step1ServiceSelection() {
  const { selectedService, setSelectedService, nextStep } = useStepFlow();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.filter((s: Service) => s.isActive));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleNext = () => {
    if (selectedService) {
      nextStep();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          서비스 선택
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          광고 소재를 생성할 서비스를 선택하세요
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>등록된 서비스가 없습니다.</p>
          <p className="text-sm mt-2">관리자 페이지에서 서비스를 추가해주세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleSelectService(service)}
              className={`
                p-6 rounded-xl border-2 transition-all text-left
                ${
                  selectedService?.id === service.id
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                }
              `}
            >
              {/* Service Icon */}
              <div className={`w-full h-32 mb-4 rounded-lg flex items-center justify-center ${
                serviceIcons[service.id]?.bgColor || 'bg-gray-100'
              } ${
                serviceIcons[service.id]?.bgColorDark || 'dark:bg-gray-800'
              }`}>
                <span className="text-6xl">
                  {serviceIcons[service.id]?.emoji || '📦'}
                </span>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {service.name}
                </h3>
                {selectedService?.id === service.id && (
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {service.keywords.slice(0, 3).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedService}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              selectedService
                ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
}
