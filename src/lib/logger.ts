export const logger = {
  info: (meta: any, msg?: string) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  },
  warn: (meta: any, msg?: string) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  },
  error: (meta: any, msg?: string) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${msg || ''}`, JSON.stringify(meta));
  }
};
