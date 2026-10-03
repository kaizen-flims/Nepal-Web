/** Resolve local public assets beneath Vite's deployment base, including Pages. */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
