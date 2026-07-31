/**
 * DATABASE_URL is optional at build time (e.g. Vercel builds without a
 * database provisioned yet). Every read goes through safeQuery so pages
 * prerender with fallback/static data instead of crashing the build, and
 * automatically switch to live data the moment DATABASE_URL is set.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseConfigured) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error("[db] query failed, using fallback data:", error);
    return fallback;
  }
}
