import { promises as fs } from 'fs';
import path from 'path';

interface Hook {
  id: string;
  type: string;
  hook_text: string;
  metric_value?: number;
  metric_unit?: string;
  comparison_value?: string;
  emotional_angle: string;
  priority_score: number;
  platform_boost: {
    naver: number;
    meta: number;
    youtube: number;
  };
}

interface Voice {
  quote: string;
  emotion: string;
}

interface ServiceHookData {
  hooks: Hook[];
  employee_voices: Voice[];
  hr_voices: Voice[];
  visual_keywords: string[];
  image_mood: string[];
}

interface SharedAssets {
  brand_trust_points: string[];
  target_audience: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

interface HookDatabase {
  [serviceId: string]: ServiceHookData | SharedAssets | Array<{ rule: string }>;
  shared_assets: SharedAssets;
  hook_selection_rules: Array<{ rule: string }>;
}

/**
 * Load service hooks database
 */
export async function loadHooksDatabase(): Promise<HookDatabase> {
  const hooksPath = path.join(process.cwd(), 'data', 'service-hooks.json');
  const data = await fs.readFile(hooksPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Calculate effective score for a hook based on platform
 */
function calculateEffectiveScore(hook: Hook, platform: 'naver' | 'meta' | 'youtube'): number {
  return hook.priority_score + hook.platform_boost[platform];
}

/**
 * Select top hooks for a service and platform
 */
export async function selectTopHooks(
  serviceId: string,
  platform: 'naver' | 'meta' | 'youtube',
  topN: number = 3
): Promise<Hook[]> {
  const database = await loadHooksDatabase();
  const serviceData = database[serviceId] as ServiceHookData;

  if (!serviceData || !serviceData.hooks) {
    throw new Error(`No hooks found for service: ${serviceId}`);
  }

  // Calculate effective scores and sort
  const scoredHooks = serviceData.hooks.map((hook) => ({
    ...hook,
    effective_score: calculateEffectiveScore(hook, platform),
  }));

  // Sort by effective score (descending)
  scoredHooks.sort((a, b) => b.effective_score - a.effective_score);

  // Apply diversification rule: avoid same type for top 2
  const selectedHooks: Hook[] = [];
  const usedTypes = new Set<string>();

  for (const hook of scoredHooks) {
    // First hook always selected
    if (selectedHooks.length === 0) {
      selectedHooks.push(hook);
      usedTypes.add(hook.type);
      continue;
    }

    // Second hook: avoid same type as first
    if (selectedHooks.length === 1 && usedTypes.has(hook.type)) {
      continue;
    }

    selectedHooks.push(hook);
    usedTypes.add(hook.type);

    if (selectedHooks.length >= topN) {
      break;
    }
  }

  // If we didn't get enough hooks (due to type filtering), fill with remaining
  if (selectedHooks.length < topN) {
    for (const hook of scoredHooks) {
      if (!selectedHooks.find((h) => h.id === hook.id)) {
        selectedHooks.push(hook);
        if (selectedHooks.length >= topN) break;
      }
    }
  }

  return selectedHooks;
}

/**
 * Get voices for a service, prioritized by platform
 */
export async function selectVoices(
  serviceId: string,
  platform: 'naver' | 'meta' | 'youtube'
): Promise<{ employee: Voice[]; hr: Voice[] }> {
  const database = await loadHooksDatabase();
  const serviceData = database[serviceId] as ServiceHookData;

  if (!serviceData) {
    return { employee: [], hr: [] };
  }

  const employee = serviceData.employee_voices || [];
  const hr = serviceData.hr_voices || [];

  // Platform-specific prioritization
  if (platform === 'meta') {
    // Meta: employee voices first (공감형)
    return { employee, hr };
  } else if (platform === 'naver') {
    // Naver: hr voices first (신뢰형)
    return { employee, hr };
  } else {
    // YouTube: both, employee first
    return { employee, hr };
  }
}

/**
 * Get visual keywords for a service
 */
export async function getVisualKeywords(serviceId: string): Promise<string[]> {
  const database = await loadHooksDatabase();
  const serviceData = database[serviceId] as ServiceHookData;
  return serviceData?.visual_keywords || [];
}

/**
 * Get image mood for a service
 */
export async function getImageMood(serviceId: string): Promise<string[]> {
  const database = await loadHooksDatabase();
  const serviceData = database[serviceId] as ServiceHookData;
  return serviceData?.image_mood || [];
}

/**
 * Get brand trust points (shared across all services)
 */
export async function getBrandTrustPoints(): Promise<string[]> {
  const database = await loadHooksDatabase();
  return database.shared_assets?.brand_trust_points || [];
}

/**
 * Get complete hook context for brief generation
 */
export async function getHookContext(
  serviceId: string,
  platform: 'naver' | 'meta' | 'youtube'
) {
  const topHooks = await selectTopHooks(serviceId, platform, 3);
  const voices = await selectVoices(serviceId, platform);
  const visualKeywords = await getVisualKeywords(serviceId);
  const imageMood = await getImageMood(serviceId);
  const brandTrustPoints = await getBrandTrustPoints();

  // Find social_proof hook for credibility
  const database = await loadHooksDatabase();
  const serviceData = database[serviceId] as ServiceHookData;
  const socialProofHook = serviceData?.hooks.find((h) => h.type === 'social_proof');

  return {
    primary_hook: topHooks[0],
    secondary_hook: topHooks[1],
    tertiary_hook: topHooks[2],
    social_proof: socialProofHook,
    employee_voices: voices.employee,
    hr_voices: voices.hr,
    visual_keywords: visualKeywords,
    image_mood: imageMood,
    brand_trust_points: brandTrustPoints,
    platform_tone:
      platform === 'meta'
        ? 'casual_friendly'
        : platform === 'naver'
        ? 'informative_trustworthy'
        : 'engaging_storytelling',
  };
}
