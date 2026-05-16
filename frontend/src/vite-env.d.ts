/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  // Agrega aquí más variables de entorno si las necesitas en el futuro
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
