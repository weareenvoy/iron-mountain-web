import mqtt, { MqttClient, IClientOptions } from "mqtt";

const MQTT_BROKER_URL =
  process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "mqtt://localhost:1883";

// Generate availability topic for a device
export const getAvailabilityTopic = (deviceId: string): string =>
  `state/${deviceId}/availability`;

// Generate device-specific client ID
const generateClientId = (deviceId: string): string =>
  `${deviceId}-${Math.random().toString(16).substring(2, 10)}`;

const MQTT_BASE_OPTIONS: Omit<IClientOptions, "clientId" | "will"> = {
  keepalive: 30,
  clean: false,
  // connectTimeout: 2 * 1000,
};

const mqttCommands = {
  docent: {
    sync: "cmd/dev/gec/sync",
    loadTour: "cmd/dev/gec/load-tour",
    endTour: "cmd/dev/all/end-tour",
    republishSettings: "cmd/dev/gec/republish-settings",
    setVolume: "cmd/dev/gec/set-volume",
  },
  basecamp: {
    gotoBeat: "cmd/dev/basecamp/goto-beat",
  },
  overlook: {
    gotoBeat: "cmd/dev/overlook/goto-beat",
  },
  summit: {
    gotoBeat: "cmd/dev/summit/goto-beat",
  },
};

// Helper functions for creating consistent MQTT message structures
const nowTs = (): string => new Date().toISOString();
const newId = (source: string): string => `${source}-${Date.now()}`;

export interface MqttMessageMeta {
  id: string;
  ts: string;
  source: string;
}

export interface MqttMessage<T = unknown> {
  meta: MqttMessageMeta;
  body: T;
}

// Helper to create a properly formatted MQTT message
export function createMqttMessage<T>(source: string, body: T): MqttMessage<T> {
  return {
    meta: {
      id: newId(source),
      ts: nowTs(),
      source,
    },
    body,
  };
}

export type MqttError = Error | mqtt.ErrorWithReasonCode;

type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type MqttServiceConfig = {
  deviceId: string; // e.g., "docent-app", "basecamp", "overlook", "overlook-tablet"
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: MqttError) => void;
};

export class MqttService {
  private client: MqttClient | null = null;
  private deviceId: string;
  private availabilityTopic: string;
  private onConnectionChange?: MqttServiceConfig["onConnectionChange"];
  private onError?: MqttServiceConfig["onError"];

  constructor(config: MqttServiceConfig) {
    this.deviceId = config.deviceId;
    this.availabilityTopic = getAvailabilityTopic(this.deviceId);
    this.onConnectionChange = config.onConnectionChange;
    this.onError = config.onError;

    this.connect();
  }

  public connect() {
    // Configure Last Will & Testament for automatic offline detection
    const optionsWithLWT: IClientOptions = {
      ...MQTT_BASE_OPTIONS,
      clientId: generateClientId(this.deviceId),
      will: {
        topic: this.availabilityTopic,
        payload: Buffer.from("offline"),
        qos: 1,
        retain: true,
      },
    };

    this.client = mqtt.connect(MQTT_BROKER_URL, optionsWithLWT);

    this.client.on("connect", () => {
      console.info(`MQTT connected as ${this.deviceId}`);

      // Birth message
      this.publish(
        this.availabilityTopic,
        "online",
        { qos: 1, retain: true },
        {
          onSuccess: () =>
            console.info(`Published availability: online for ${this.deviceId}`),
          onError: (err) =>
            console.error(`Failed to publish availability:`, err),
        },
      );

      this.subscribeToTopics();
      this.onConnectionChange?.(true);
    });

    this.client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      this.onError?.(err);
    });

    this.client.on("close", () => {
      console.info("MQTT connection closed");
      this.client = null;
      this.onConnectionChange?.(false);
    });

    // No global message handling - each route handles its own messages
  }

  public disconnect(): void {
    if (this.client?.connected) {
      // Publish offline before we go offline
      this.publish(
        this.availabilityTopic,
        "offline",
        { qos: 1, retain: true },
        {
          onSuccess: () => {
            console.info(
              `Published availability: offline for ${this.deviceId}`,
            );
            this.client?.end(false, () => {
              console.info("MQTT disconnected");
              this.client = null;
              this.onConnectionChange?.(false);
            });
          },
          onError: (err) => {
            console.error("Failed to publish offline status:", err);
            // Still disconnect even if publish fails
            this.client?.end(false, () => {
              this.client = null;
              this.onConnectionChange?.(false);
            });
          },
        },
      );
    }
  }

  private subscribe(topic: string) {
    this.client?.subscribe(topic, (err) => {
      if (err) {
        console.error(`Subscription to ${topic} failed:`, err);
        return;
      }
      console.info(`Subscribed to ${topic}`);
    });
  }

  private subscribeToTopics(): void {
    // No global topics - each route handles its own subscriptions
    console.info("MQTT connected - ready for custom subscriptions");
  }

  public publish(
    topic: string,
    message: string,
    options?: {
      qos?: 0 | 1 | 2;
      retain?: boolean;
    },
    config?: PublishArgsConfig,
  ): void {
    const publishOptions = {
      qos: options?.qos ?? 1,
      retain: options?.retain ?? false,
    };

    this.client?.publish(topic, message, publishOptions, (err) => {
      if (err) {
        console.error("Publish error:", err);
        config?.onError?.(err);
      } else {
        config?.onSuccess?.();
      }
    });
  }

  // Docent App → GEC: Request sync
  public sendSync(config?: PublishArgsConfig): void {
    const message = createMqttMessage("docent-app", {
      reason: "manual-sync",
    });

    console.info("Sending sync command to GEC");
    this.publish(
      mqttCommands.docent.sync,
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Docent App → GEC: Load tour
  public loadTour(tourId: string, config?: PublishArgsConfig): void {
    const message = createMqttMessage("docent-app", {
      "tour-id": tourId,
    });

    console.info("Sending load-tour command to GEC:", tourId);
    this.publish(
      mqttCommands.docent.loadTour,
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Docent App → ALL: End tour (broadcast to all exhibits)
  public endTour(config?: PublishArgsConfig): void {
    const message = createMqttMessage("docent-app", {});

    console.info("Sending end-tour command to all exhibits");
    this.publish(
      mqttCommands.docent.endTour, // cmd/dev/all/end-tour
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Exhibit → State: Report full exhibit state (retained)
  // This publishes the complete state to state/<exhibit>
  public reportExhibitState(
    exhibit: "basecamp" | "overlook" | "summit",
    state: {
      "tour-id"?: string | null;
      slide: string;
      "volume-level": number;
      "volume-muted": boolean;
      playpause?: boolean; // Only for overlook/summit
    },
    config?: PublishArgsConfig,
  ): void {
    const message = createMqttMessage(exhibit, state);

    console.info(`${exhibit} reporting full state:`, state);
    this.publish(
      `state/${exhibit}`,
      JSON.stringify(message),
      { qos: 1, retain: true }, // Retained
      config,
    );
  }

  // Docent App → GEC: Request GEC to republish current settings
  public republishSettings(config?: PublishArgsConfig): void {
    const message = createMqttMessage("docent-app", {});

    console.info("Requesting GEC to republish settings");
    this.publish(
      mqttCommands.docent.republishSettings,
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Docent App → GEC: Set volume (mute/unmute) for an exhibit
  public setVolume(
    subject: "basecamp" | "overlook" | "summit",
    muted: boolean,
    config?: PublishArgsConfig,
  ): void {
    const message = createMqttMessage("docent-app", {
      subject,
      muted,
    });

    console.info(
      `Setting volume for ${subject}: ${muted ? "muted" : "unmuted"}`,
    );
    this.publish(
      mqttCommands.docent.setVolume,
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Docent App → Exhibit: Direct command to go to a specific beat
  public gotoBeat(
    exhibit: "basecamp" | "overlook" | "summit",
    beatId: string,
    config?: PublishArgsConfig,
  ): void {
    const message = createMqttMessage("docent-app", {
      beat_id: beatId,
    });

    console.info(`Sending goto-beat to ${exhibit}: ${beatId}`);
    this.publish(
      `cmd/dev/${exhibit}/goto-beat`,
      JSON.stringify(message),
      { qos: 1, retain: false },
      config,
    );
  }

  // Custom subscription methods for route-specific topics
  public subscribeToTopic(
    topic: string,
    handler: (message: Buffer) => void,
  ): void {
    this.client?.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${topic}:`, err);
        return;
      }
      console.info(`Subscribed to custom topic: ${topic}`);
    });

    // Store the handler for this topic
    this.client?.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        handler(message);
      }
    });
  }

  public unsubscribeFromTopic(topic: string): void {
    this.client?.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to unsubscribe from ${topic}:`, err);
        return;
      }
      console.info(`Unsubscribed from custom topic: ${topic}`);
    });
  }
}
