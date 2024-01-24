import { RemoteSerialPort } from 'remote-serial-port-client';

/*
declare namespace 'remote-serial-port-client' {
  export interface RemoteSerialPortClient {
    RemoteSerialPort: RSPCConstructor;
  }
}

interface RSPCOptions {
  mode: 'tcp';
  host: string;
  port: number;
}

interface RSPCConstructor {
  new ({options: RSPCOptions}): RSPC
}

interface RSPC {}
*/

interface Client{}

interface Options {

}

interface RemoteSerialPortConstructor {
  new(options: Options): Client;
}

export const RemoteSerialPort: RemoteSerialPortConstructor;

/*
declare namespace "remote-serial-port-client" {
  export interface ProcessEnv {
    RemoteSerialPort: RemoteSerialPortConstructor
  }
}*/
