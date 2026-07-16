export const logger = {
  info: (meta: unknown, msg?: string) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  },
  warn: (meta: unknown, msg?: string) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  },
  error: (meta: unknown, msg?: string) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  }
};
