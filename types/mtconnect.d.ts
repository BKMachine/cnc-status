interface MTConnectResponse {
  MTConnectStreams: {
    Streams: {
      DeviceStream: DeviceStream[];
    };
  };
}

interface DeviceStream {
  '@_name': string;
  '@_uuid': string;
}
