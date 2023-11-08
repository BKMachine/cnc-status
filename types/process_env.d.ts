declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;
    NODE_ENV: 'production' | 'development'
  }
}
