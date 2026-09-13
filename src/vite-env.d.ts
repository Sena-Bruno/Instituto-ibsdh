/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** DSN do Sentry. Ausente = monitoramento desligado. */
  readonly VITE_SENTRY_DSN?: string;
  /**
   * Fluxo de dados do Google Analytics 4 (`G-XXXXXXXXXX`).
   * Ausente = medição desligada, e o gtag.js não entra no pacote.
   */
  readonly VITE_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
