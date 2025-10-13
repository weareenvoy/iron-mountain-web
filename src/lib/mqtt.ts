import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { StateData, ToastData } from "@/types";
import pubsub from "pubsub-js";
import { toast } from "sonner";

const MQTT_BROKER_URL =
  process.env.NEXT_PUBLIC_MQTT_BROKER_URL || "mqtt://localhost:1883";

const CLIENT_ID = `${process.env.NODE_ENV === "production" ? "prod" : "dev"}_iron_mountain_web_${Math.random().toString(16).substring(2, 10)}`;

const MQTT_OPTIONS: IClientOptions = {
  clientId: CLIENT_ID,
  // connectTimeout: 2 * 1000,
};

// TODO all topic names and commands are TBD. use "xxx" as placeholder.
export enum MqttCommand {
  GetState = "get_state",
}

export enum MqttTopic {
  StateData = "xxx/state_data",
  Toast = "xxx/toast", // we might receive toast like "something is successfully updated" and we could show them in docent app.
  Error = "xxx/error", // error, warning, info topics are for internal debugging
  Warning = "xxx/warning",
  Info = "xxx/info",
}

const subscriptionTopics = Object.values(MqttTopic);

export type MqttError = Error | mqtt.ErrorWithReasonCode;

type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type MqttServiceConfig = {
  onReceiveState?: (state: StateData) => void;
  onReceiveToast?: (toast: ToastData) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: MqttError) => void;
};

export class MqttService {
  private client: MqttClient | null = null;
  private onReceiveState?: MqttServiceConfig["onReceiveState"];
  private onReceiveToast?: MqttServiceConfig["onReceiveToast"];
  private onConnectionChange?: MqttServiceConfig["onConnectionChange"];
  private onError?: MqttServiceConfig["onError"];

  constructor(config: MqttServiceConfig) {
    this.onReceiveState = config.onReceiveState;
    this.onReceiveToast = config.onReceiveToast;
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

    this.client.on("message", this.handleReceiveMessage.bind(this));
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

      // TBD. We might need this to get initial state, or we would use regular fetch to get all data needed.
      if (topic === MqttTopic.StateData) {
        this.client?.publish(
          "xxx/command",
          JSON.stringify({ command_id: MqttCommand.GetState }),
        );
      }
    });
  }

  private subscribeToTopics(): void {
    for (const topic of subscriptionTopics) {
      this.subscribe(topic);
    }
  }

  private handleReceiveMessage(topic: string, message: Buffer): void {
    const parsedMessage = JSON.parse(message.toString());

    console.info("Received message:", topic, parsedMessage);
    pubsub.publish(topic, parsedMessage);

    switch (topic) {
      case MqttTopic.StateData:
        this.onReceiveState?.(parsedMessage);
        break;
      case MqttTopic.Toast:
        this.onReceiveToast?.(parsedMessage);
        break;

      default:
        console.info("Received unknown message:", parsedMessage);
        toast.warning(
          `DEBUG: ${parsedMessage.error ?? "Unknown message received"}`,
        );
    }
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
      "gec/coffee-app/command",
      JSON.stringify({
        command_id: command,
        command_args: args,
      }),
      config,
    );
  }

  public getCurrentState(config?: PublishArgsConfig): void {
    this.publishCommand(MqttCommand.GetState, undefined, config);
  }
}
