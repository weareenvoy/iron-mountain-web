import mqtt, { MqttClient, IClientOptions } from "mqtt";

const MQTT_BROKER_URL =
  process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "mqtt://localhost:1883";

const CLIENT_ID = `${process.env.NODE_ENV === "production" ? "prod" : "dev"}_iron_mountain_web_${Math.random().toString(16).substring(2, 10)}`;

const MQTT_OPTIONS: IClientOptions = {
  clientId: CLIENT_ID,
  // connectTimeout: 2 * 1000,
};

// TODO. All the commands and topics are TBD.
export enum MqttCommand {
  EndTour = "end_tour",
  ResetState = "reset_state",
}
// GetState = "get_state",

// No global topics - each route handles its own subscriptions

export type MqttError = Error | mqtt.ErrorWithReasonCode;

type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type MqttServiceConfig = {
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: MqttError) => void;
};

export class MqttService {
  private client: MqttClient | null = null;
  private onConnectionChange?: MqttServiceConfig["onConnectionChange"];
  private onError?: MqttServiceConfig["onError"];

  constructor(config: MqttServiceConfig) {
    this.onConnectionChange = config.onConnectionChange;
    this.onError = config.onError;

    this.connect();
  }

  public connect() {
    this.client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

    this.client.on("connect", () => {
      console.info("MQTT connected");
      this.subscribeToTopics();
      this.onConnectionChange?.(true);
    });

    this.client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      console.info(this.onError);

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
      this.client.end(false, () => {
        console.info("MQTT disconnected");
        this.client = null;
        this.onConnectionChange?.(false);
      });
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
    config?: PublishArgsConfig,
  ): void {
    // Not using {qos:1} now
    this.client?.publish(topic, message, (err) => {
      if (err) {
        console.error("Publish error:", err);
        config?.onError?.(err);
      } else {
        config?.onSuccess?.();
      }
    });
  }

  public publishCommand(
    command: MqttCommand,
    args?: unknown,
    config?: PublishArgsConfig,
  ): void {
    console.info("Sending command:", command, args);

    this.publish(
      // This name is totally made up.
      "gec/iron-mountain-web/command",
      JSON.stringify({
        command_id: command,
        command_args: args,
      }),
      config,
    );
  }


  // TODO These 2 are copied over from tmo. They are only for docent app, should they live here?
  public endTour(config?: PublishArgsConfig): void {
    // Send immediately (not debounced) to avoid being canceled by navigation
    console.info("Sending command:", MqttCommand.EndTour);
    this.publish(
      "gec/docent/command",
      JSON.stringify({
        command_id: MqttCommand.EndTour,
        command_args: undefined,
      }),
      config,
    );
  }
  // it's called resetState, but it's actually loading a tour.
  public resetState(
    tourId: string,
    config?: PublishArgsConfig,
  ): void {
    this.publishCommand(
      MqttCommand.ResetState,
      { tour_id: tourId },
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
