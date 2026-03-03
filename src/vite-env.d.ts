/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_TEMPLATE?: string;
  readonly VITE_DEFAULT_LANG?: string;
  readonly VITE_DEFAULT_MOBILE_LAYOUT?: string;
  readonly VITE_DEFAULT_COLOR_THEME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
