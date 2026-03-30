import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const dataDir = path.join(projectRoot, "data");
const seedPath = path.join(dataDir, "seed.json");
const storePath = path.join(dataDir, "store.json");

let inMemoryStore = null;

async function ensureStoreFile() {
  try {
    await fs.access(storePath);
  } catch {
    const seedRaw = await fs.readFile(seedPath, "utf8");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(storePath, seedRaw);
  }
}

export async function readStore() {
  if (inMemoryStore) {
    return structuredClone(inMemoryStore);
  }

  await ensureStoreFile();
  const raw = await fs.readFile(storePath, "utf8");
  inMemoryStore = JSON.parse(raw);
  return structuredClone(inMemoryStore);
}

export async function writeStore(nextStore) {
  inMemoryStore = structuredClone(nextStore);
  await fs.writeFile(storePath, `${JSON.stringify(nextStore, null, 2)}\n`);
  return structuredClone(inMemoryStore);
}

export async function updateStore(mutator) {
  const store = await readStore();
  const result = await mutator(store);
  await writeStore(store);
  return result;
}

export function makeId(prefix) {
  const now = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${now}-${random}`;
}
