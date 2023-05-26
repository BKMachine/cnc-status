interface MTConnect {
  MTConnectStreams: {
    Header: {
      bufferSize: number;
      creationTime: string;
      deviceModelChangeTime: string;
      firstSequence: number;
      instanceId: number;
      lastSequence: number;
      nextSequence: number;
      schemaVersion: string;
      sender: string;
      testIndicator: boolean;
      version: string;
    };
    Streams: {
      DeviceStream: ComponentStream[]
    };
    jsonVersion: number;
  }
}

interface ComponentStream {
  ComponentStream: Component[]
}

interface Component {
  Events: Event,
  Samples: Sample,
  Conditions: Condition,
  component: 'Agent' | 'Adapter',
  componentId: string,
  name: string,
}

interface Event {
 [key: string]: any
}

interface Sample {
  [key: string]: any
}

interface Condition {
  [key: string]: any
}
