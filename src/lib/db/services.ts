import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Service } from '@/types';

const SERVICES_PATH = path.join(process.cwd(), 'data', 'services.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Read all services
 */
export async function getServices(): Promise<Service[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SERVICES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices();
  return services.find(s => s.id === id) || null;
}

/**
 * Create a new service
 */
export async function createService(
  data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Service> {
  await ensureDataDir();
  const services = await getServices();

  const newService: Service = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  services.push(newService);
  await fs.writeFile(SERVICES_PATH, JSON.stringify(services, null, 2));

  return newService;
}

/**
 * Update a service
 */
export async function updateService(
  id: string,
  updates: Partial<Omit<Service, 'id' | 'createdAt'>>
): Promise<Service | null> {
  const services = await getServices();
  const index = services.findIndex(s => s.id === id);

  if (index === -1) {
    return null;
  }

  services[index] = {
    ...services[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(SERVICES_PATH, JSON.stringify(services, null, 2));

  return services[index];
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<boolean> {
  const services = await getServices();
  const filtered = services.filter(s => s.id !== id);

  if (filtered.length === services.length) {
    return false; // Service not found
  }

  await fs.writeFile(SERVICES_PATH, JSON.stringify(filtered, null, 2));

  return true;
}
