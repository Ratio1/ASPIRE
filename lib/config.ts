const rawDebug = process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true';

function ensureHttpProtocol(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://${url}`;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'n'].includes(normalized)) {
    return false;
  }
  return fallback;
}

function parseChainstorePeers(value: string | undefined): string[] {
  const raw = value?.trim();
  if (!raw) {
    return [];
  }

  try {
    let cleaned = raw;

    if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
      cleaned = cleaned.slice(1, -1);
    }

    cleaned = cleaned.replace(/'/g, '"');
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error('CHAINSTORE_PEERS must be a JSON array');
    }

    return parsed.map((entry) => {
      if (typeof entry !== 'string') {
        throw new Error('CHAINSTORE_PEERS entries must be strings');
      }
      return ensureHttpProtocol(entry)!;
    });
  } catch (error) {
    console.error('Failed to parse CHAINSTORE_PEERS env var:', error);
    throw error;
  }
}

const cstoreApiUrl = ensureHttpProtocol(
  process.env.EE_CHAINSTORE_API_URL || process.env.CHAINSTORE_API_URL
);

const r1fsApiUrl = ensureHttpProtocol(
  process.env.EE_R1FS_API_URL || process.env.R1FS_API_URL
);

const chainstorePeers = parseChainstorePeers(
  process.env.EE_CHAINSTORE_PEERS || process.env.CHAINSTORE_PEERS
);

const rawUseMocks = process.env.NEXT_PUBLIC_RATIO1_USE_MOCKS || process.env.RATIO1_USE_MOCKS;
const fallbackUseMocks = !(cstoreApiUrl && r1fsApiUrl);
const useMocks = parseBoolean(rawUseMocks, fallbackUseMocks);

export const platformConfig = {
  DEBUG: rawDebug,
  useMocks,
  cstoreApiUrl,
  r1fsApiUrl,
  chainstorePeers,
  casesHKey: process.env.RATIO1_CASES_HKEY || 'ratio1-asd-cases',
  jobsHKey: process.env.RATIO1_JOBS_HKEY || 'ratio1-asd-jobs',
  demoCredentials: {
    username: process.env.RATIO1_DEMO_USERNAME || 'demo',
    password: process.env.RATIO1_DEMO_PASSWORD || 'demo'
  }
} as const;

export type PlatformConfig = typeof platformConfig;

