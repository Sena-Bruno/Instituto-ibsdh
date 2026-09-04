/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** DSN do Sentry. Ausente = monitoramento desligado. */
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
