declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;
    NODE_ENV: 'production' | 'development'
  }
}

module 'remote-serial-port-client'
