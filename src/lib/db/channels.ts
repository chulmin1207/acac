import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Channel } from '@/types';

const CHANNELS_PATH = path.join(process.cwd(), 'data', 'channels.json');

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
 * Read all channels
 */
export async function getChannels(): Promise<Channel[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CHANNELS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
}

/**
 * Get channel by ID
 */
export async function getChannelById(id: string): Promise<Channel | null> {
  const channels = await getChannels();
  return channels.find(c => c.id === id) || null;
}

/**
 * Get active channels only
 */
export async function getActiveChannels(): Promise<Channel[]> {
  const channels = await getChannels();
  return channels.filter(c => c.isActive);
}

/**
 * Create a new channel
 */
export async function createChannel(
  data: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Channel> {
  await ensureDataDir();
  const channels = await getChannels();

  const newChannel: Channel = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  channels.push(newChannel);
  await fs.writeFile(CHANNELS_PATH, JSON.stringify(channels, null, 2));

  return newChannel;
}

/**
 * Update a channel
 */
export async function updateChannel(
  id: string,
  updates: Partial<Omit<Channel, 'id' | 'createdAt'>>
): Promise<Channel | null> {
  const channels = await getChannels();
  const index = channels.findIndex(c => c.id === id);

  if (index === -1) {
    return null;
  }

  channels[index] = {
    ...channels[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(CHANNELS_PATH, JSON.stringify(channels, null, 2));

  return channels[index];
}

/**
 * Delete a channel
 */
export async function deleteChannel(id: string): Promise<boolean> {
  const channels = await getChannels();
  const filtered = channels.filter(c => c.id !== id);

  if (filtered.length === channels.length) {
    return false; // Channel not found
  }

  await fs.writeFile(CHANNELS_PATH, JSON.stringify(filtered, null, 2));

  return true;
}
