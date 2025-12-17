declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Optional API URL / base path for backend services.
     */
    readonly VITE_API_URL?: string

    /**
     * Google OAuth client ID exposed via Vite config.
     */
    readonly VITE_GOOGLE_CLIENT_ID?: string

    readonly [key: string]: string | undefined
  }

  interface Process {
    readonly env: ProcessEnv
    cwd(): string
  }
}

declare const process: NodeJS.Process

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css'
