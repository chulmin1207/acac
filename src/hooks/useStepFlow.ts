import { create } from 'zustand';
import type {
  Service,
  Brief,
  ReferenceAnalysis,
  GeneratedImage,
  Creative,
} from '@/types';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface StepFlowState {
  // Current step
  currentStep: StepNumber;

  // Step 1: Service Selection
  selectedService: Service | null;

  // Step 2: Creative Input
  userInput: string;
  referenceImages: File[];
  referenceImageUrls: string[];
  referenceAnalysis: ReferenceAnalysis | null;

  // Step 3: Brief Generation
  brief: Brief | null;

  // Step 4: Image Generation
  generatedImages: GeneratedImage[];
  selectedImage: GeneratedImage | null;

  // Step 5 & 6: Creative Production
  creative: Creative | null;
  selectedChannelIds: string[];

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StepNumber) => void;
  reset: () => void;

  // Step 1
  setSelectedService: (service: Service | null) => void;

  // Step 2
  setUserInput: (input: string) => void;
  addReferenceImage: (file: File) => void;
  removeReferenceImage: (index: number) => void;
  setReferenceImageUrls: (urls: string[]) => void;
  setReferenceAnalysis: (analysis: ReferenceAnalysis | null) => void;

  // Step 3
  setBrief: (brief: Brief | null) => void;

  // Step 4
  setGeneratedImages: (images: GeneratedImage[]) => void;
  setSelectedImage: (image: GeneratedImage | null) => void;

  // Step 5
  setCreative: (creative: Creative | null) => void;
  setSelectedChannelIds: (ids: string[]) => void;
  toggleChannelId: (id: string) => void;
}

export const useStepFlow = create<StepFlowState>((set) => ({
  // Initial state
  currentStep: 1,
  selectedService: null,
  userInput: '',
  referenceImages: [],
  referenceImageUrls: [],
  referenceAnalysis: null,
  brief: null,
  generatedImages: [],
  selectedImage: null,
  creative: null,
  selectedChannelIds: [],

  // Navigation
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(6, state.currentStep + 1) as StepNumber,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1) as StepNumber,
    })),

  goToStep: (step) => set({ currentStep: step }),

  reset: () =>
    set({
      currentStep: 1,
      selectedService: null,
      userInput: '',
      referenceImages: [],
      referenceImageUrls: [],
      referenceAnalysis: null,
      brief: null,
      generatedImages: [],
      selectedImage: null,
      creative: null,
      selectedChannelIds: [],
    }),

  // Step 1
  setSelectedService: (service) => set({ selectedService: service }),

  // Step 2
  setUserInput: (input) => set({ userInput: input }),

  addReferenceImage: (file) =>
    set((state) => ({
      referenceImages: [...state.referenceImages, file],
    })),

  removeReferenceImage: (index) =>
    set((state) => ({
      referenceImages: state.referenceImages.filter((_, i) => i !== index),
      referenceImageUrls: state.referenceImageUrls.filter((_, i) => i !== index),
    })),

  setReferenceImageUrls: (urls) => set({ referenceImageUrls: urls }),

  setReferenceAnalysis: (analysis) => set({ referenceAnalysis: analysis }),

  // Step 3
  setBrief: (brief) => set({ brief: brief }),

  // Step 4
  setGeneratedImages: (images) => set({ generatedImages: images }),

  setSelectedImage: (image) => set({ selectedImage: image }),

  // Step 5
  setCreative: (creative) => set({ creative: creative }),

  setSelectedChannelIds: (ids) => set({ selectedChannelIds: ids }),

  toggleChannelId: (id) =>
    set((state) => ({
      selectedChannelIds: state.selectedChannelIds.includes(id)
        ? state.selectedChannelIds.filter((channelId) => channelId !== id)
        : [...state.selectedChannelIds, id],
    })),
}));
