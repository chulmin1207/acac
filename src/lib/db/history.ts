import { promises as fs } from 'fs';
import path from 'path';
import type { Creative } from '@/types';

const HISTORY_DIR = path.join(process.cwd(), 'data', 'history');

/**
 * Ensure history directory exists
 */
async function ensureHistoryDir() {
  try {
    await fs.access(HISTORY_DIR);
  } catch {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
  }
}

/**
 * Save creative to history
 */
export async function saveCreativeHistory(creative: Creative): Promise<string> {
  await ensureHistoryDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}_${creative.id}.json`;
  const filePath = path.join(HISTORY_DIR, filename);

  await fs.writeFile(filePath, JSON.stringify(creative, null, 2));

  return filePath;
}

/**
 * Get all creative history
 */
export async function getCreativeHistory(): Promise<Creative[]> {
  try {
    await ensureHistoryDir();
    const files = await fs.readdir(HISTORY_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const creatives = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(HISTORY_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as Creative;
      })
    );

    return creatives.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Get creative by ID from history
 */
export async function getCreativeById(id: string): Promise<Creative | null> {
  const history = await getCreativeHistory();
  return history.find(c => c.id === id) || null;
}
