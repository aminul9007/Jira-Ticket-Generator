/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_OPENAI_MODEL?: string
  /** auto | llama-cpp | openai */
  readonly VITE_AI_PROVIDER?: string
  readonly VITE_LLAMACPP_ENABLED?: string
  readonly VITE_LLAMACPP_BASE_URL?: string
  readonly VITE_LLAMACPP_API_KEY?: string
  readonly VITE_LLAMACPP_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
