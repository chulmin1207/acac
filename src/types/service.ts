/**
 * Service interface - represents a client service (e.g., snack24h)
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  tagline?: string;
  url?: string;
  ctaUrl?: string;
  keywords: string[];
  thumbnail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
