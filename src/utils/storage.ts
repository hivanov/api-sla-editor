
const STORAGE_KEY = 'sla-editor-files';
const CURRENT_ID_KEY = 'sla-editor-current-id';
const MAX_HISTORY = 50;
const HISTORY_THRESHOLD = 5 * 60 * 1000; // 5 minutes between history points

export interface SlaVersion {
  content: string;
  timestamp: number;
}

export interface SlaFile {
  id: string;
  current: string;
  history: SlaVersion[];
  lastModified: number;
}

export interface SlaStorage {
  [id: string]: SlaFile;
}

export function getStorage(): SlaStorage {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse storage', e);
    return {};
  }
}

export function saveStorage(storage: SlaStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

export function saveSla(id: string, content: string, forceHistory = false) {
  const storage = getStorage();
  const now = Date.now();
  
  if (!storage[id]) {
    storage[id] = {
      id,
      current: content,
      history: [{ content, timestamp: now }],
      lastModified: now
    };
  } else {
    const file = storage[id];
    // Only update if content changed
    if (file.current !== content) {
      const lastEntry = file.history[0];
      const shouldPushHistory = forceHistory || !lastEntry || (now - lastEntry.timestamp > HISTORY_THRESHOLD);

      if (shouldPushHistory) {
        file.history.unshift({ content: file.current, timestamp: file.lastModified });
        if (file.history.length > MAX_HISTORY) {
          file.history.pop();
        }
      }
      file.current = content;
      file.lastModified = now;
    }
  }
  
  saveStorage(storage);
  localStorage.setItem(CURRENT_ID_KEY, id);
}

export function getCurrentSlaId(): string | null {
  return localStorage.getItem(CURRENT_ID_KEY);
}

export function getSla(id: string): SlaFile | null {
  const storage = getStorage();
  return storage[id] || null;
}

export function getAllSlas(): SlaFile[] {
  const storage = getStorage();
  return Object.values(storage).sort((a, b) => b.lastModified - a.lastModified);
}

export function deleteSla(id: string) {
  const storage = getStorage();
  delete storage[id];
  saveStorage(storage);
  if (getCurrentSlaId() === id) {
    localStorage.removeItem(CURRENT_ID_KEY);
  }
}
