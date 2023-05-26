interface MTConnect {
  "MTConnectStreams": {
    "$": {
      "xmlns:m": "urn:mtconnect.org:MTConnectStreams:2.0",
      "xmlns": "urn:mtconnect.org:MTConnectStreams:2.0",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation": "urn:mtconnect.org:MTConnectStreams:2.0 /schemas/MTConnectStreams_2.0.xsd"
    },
    "Header": [
      {
        "$": {
          "creationTime": string,
          "sender": string,
          "instanceId": string,
          "version": string,
          "deviceModelChangeTime": string,
          "bufferSize": string,
          "nextSequence": string,
          "firstSequence": string,
          "lastSequence": string
        }
      }
    ],
    "Streams": [
      {
        "DeviceStream": DeviceStream[],
      }
    ]
  }
}

interface DeviceStream {
  "$": {
    "name": string,
    "uuid": string
  },
  "ComponentStream": ComponentStream[]
}

interface ComponentStream {
  "$": {
    "component": string,
    "name": string,
    "componentId": string
  },
  "Samples"?: Sample[],
  "Events"?: Event[],
  "Condition"?: Condition[],
}

interface Event {
  [key: string]:
    {
      "_": string,
      "$": {
        "dataItemId": string,
        "sequence": string,
        "timestamp": string,
        name?: string,
        assetType?: string,
        count?: string,
      }
    }[]
}

interface Sample {
  [key: string]:
    {
      "_": string,
      "$": {
        "dataItemId": string,
        "name"?: string,
        "sequence": string,
        "statistic"?: string,
        "timestamp": string,
        duration?: string,
        subType?: string,
      }
    }[]

}

interface Condition {
  [key: string]:
    {
      "$": {
        "dataItemId": string,
        "sequence": string,
        "timestamp": string,
        "type": string
      }
    }[]
}
