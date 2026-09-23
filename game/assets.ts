declare const __RICHMONKE_BASE_PATH__: string;

const basePath = typeof __RICHMONKE_BASE_PATH__ === 'string' ? __RICHMONKE_BASE_PATH__ : '';

export function assetUrl(path: string) {
  return `${basePath}${path}`;
}
