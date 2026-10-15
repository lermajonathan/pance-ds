export const define = <T extends Record<string, string>>(en: T, es: Record<keyof T, string>) => ({ en, es })
