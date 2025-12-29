import mqtt, { MqttClient, type IClientOptions } from 'mqtt';
import { getMqttBrokerUrl, MQTT_BASE_OPTIONS, mqttCommands } from '../constants';
import { createMqttMessage } from './create-mqtt-message';
import { generateClientId } from './generate-client-id';
import { getAvailabilityTopic } from './get-availability-topic';
import type { DeviceId, MqttError, MqttServiceConfig, PublishArgsConfig } from '../types';
import type { ExhibitBeatId, OverlookBeatId } from '@/lib/internal/types';

export class MqttService {
  private readonly availabilityTopic: string;
  private client: MqttClient | null = null;
  private readonly deviceId: DeviceId;
  private readonly messageHandlers = new Map<string, Set<(message: Buffer) => void>>();
  private readonly onConnectionChange?: MqttServiceConfig['onConnectionChange'];
  private readonly onError?: MqttServiceConfig['onError'];

  constructor(config: MqttServiceConfig) {
    this.deviceId = config.deviceId;
    this.availabilityTopic = getAvailabilityTopic(config.deviceId);
    this.onConnectionChange = config.onConnectionChange;
    this.onError = config.onError;

    this.connect();
  }

  public connect() {
    // Configure Last Will & Testament for automatic offline detection
    const offlineMessage = createMqttMessage(this.deviceId, { status: 'offline' });
    const optionsWithLWT: IClientOptions = {
      ...MQTT_BASE_OPTIONS,
      clientId: generateClientId(this.deviceId),
      will: {
        payload: Buffer.from(JSON.stringify(offlineMessage)),
        qos: 1,
        retain: true,
        topic: this.availabilityTopic,
      },
    };

    const brokerUrl = getMqttBrokerUrl();
    this.client = mqtt.connect(brokerUrl, optionsWithLWT);

    this.client.on('connect', () => {
      console.info(`MQTT connected as ${this.deviceId}`);

      // Birth message
      const onlineMessage = createMqttMessage(this.deviceId, { status: 'online' });
      this.publish(
        this.availabilityTopic,
        JSON.stringify(onlineMessage),
        { qos: 1, retain: true },
        {
          onError: (err: MqttError) => console.error('Failed to publish availability:', err),
          onSuccess: () => console.info(`Published availability: online for ${this.deviceId}`),
        }
      );

      // Resubscribe to all topics in the handler map upon reconnection
      this.messageHandlers.forEach((_, topic) => {
        this.client?.subscribe(topic, (err: Error | null) => {
          if (err) console.error(`Resubscription to ${topic} failed:`, err);
        });
      });

      this.onConnectionChange?.(true);
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      const handlers = this.messageHandlers.get(topic);
      if (handlers) {
        handlers.forEach(handler => handler(message));
      }
    });

    this.client.on('error', (err: MqttError) => {
      console.error('MQTT connection error:', err);
      this.onError?.(err);
    });

    this.client.on('close', () => {
      console.info('MQTT connection closed');
      this.client = null;
      this.onConnectionChange?.(false);
    });
  }

  public disconnect(): void {
    if (this.client?.connected) {
      // Publish offline before we go offline
      const offlineMessage = createMqttMessage(this.deviceId, { status: 'offline' });
      this.publish(
        this.availabilityTopic,
        JSON.stringify(offlineMessage),
        { qos: 1, retain: true },
        {
          onError: (err: MqttError) => {
            console.error('Failed to publish offline status:', err);
            // Still disconnect even if publish fails
            this.client?.end(false, () => {
              this.client = null;
              this.onConnectionChange?.(false);
            });
          },
          onSuccess: () => {
            console.info(`Published availability: offline for ${this.deviceId}`);
            this.client?.end(false, () => {
              console.info('MQTT disconnected');
              this.client = null;
              this.onConnectionChange?.(false);
            });
          },
        }
      );
    }
  }

  // Docent App → ALL: End tour (broadcast to all exhibits)
  public endTour(config?: PublishArgsConfig): void {
    const message = createMqttMessage('docent-app', {});

    console.info('Sending end-tour command to all exhibits');
    this.publish(
      mqttCommands.docent.endTour, // cmd/dev/all/end-tour
      JSON.stringify(message),
      { qos: 1, retain: false },
      config
    );
  }

  // Docent App → Exhibit: Direct command to go to a specific beat
  public gotoBeat(
    exhibit: 'basecamp' | 'overlook-wall' | 'summit',
    beatId: ExhibitBeatId,
    config?: PublishArgsConfig,
    presentationMode?: boolean
  ): void {
    const messageBody: { 'beat-id': ExhibitBeatId; 'presentation-mode'?: boolean } = {
      'beat-id': beatId,
    };
    if (presentationMode !== undefined) {
      messageBody['presentation-mode'] = presentationMode;
    }
    const message = createMqttMessage('docent-app', messageBody);

    console.info(
      `Sending goto-beat to ${exhibit}: ${beatId}${presentationMode !== undefined ? ` (presentation-mode: ${presentationMode})` : ''}`
    );
    this.publish(`cmd/dev/${exhibit}/goto-beat`, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Video beat play/pause control
  // NOTE: Only overlook-wall supports playpause in GEC state. Basecamp and summit ignore this field.
  // Use gotoBeat() for basecamp and summit instead.
  public gotoBeatWithPlayPause(
    exhibit: 'overlook-wall',
    beatId: OverlookBeatId,
    playPause: boolean,
    config?: PublishArgsConfig,
    presentationMode?: boolean
  ): void {
    const messageBody: {
      'beat-id': ExhibitBeatId;
      'playpause': boolean;
      'presentation-mode'?: boolean;
    } = {
      'beat-id': beatId,
      'playpause': playPause,
    };
    if (presentationMode !== undefined) {
      messageBody['presentation-mode'] = presentationMode;
    }
    const message = createMqttMessage('docent-app', messageBody);

    this.publish(`cmd/dev/${exhibit}/goto-beat`, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Docent App → GEC: Load tour
  public loadTour(tourId: string, config?: PublishArgsConfig): void {
    const message = createMqttMessage('docent-app', {
      'tour-id': tourId,
    });

    console.info('Sending load-tour command to GEC:', tourId);
    this.publish(mqttCommands.docent.loadTour, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  public publish(
    topic: string,
    message: string,
    options?: {
      qos?: 0 | 1 | 2;
      retain?: boolean;
    },
    config?: PublishArgsConfig
  ): void {
    const publishOptions = {
      qos: options?.qos ?? 1,
      retain: options?.retain ?? false,
    };

    this.client?.publish(topic, message, publishOptions, err => {
      if (err) {
        console.error('Publish error:', err);
        config?.onError?.(err);
      } else {
        config?.onSuccess?.();
      }
    });
  }

  // Exhibit → State: Report full exhibit state (retained)
  // This publishes the complete state to state/<exhibit>
  // Note: MQTT topics use 'overlook' but we accept 'overlook-wall' for consistency with other methods
  public reportExhibitState(
    exhibit: 'basecamp' | 'overlook-wall' | 'summit',
    state: {
      'beat-id': string;
      'playpause'?: boolean; // Only for overlook/summit
      'tour-id'?: null | string;
      'volume-level': number;
      'volume-muted': boolean;
    },
    config?: PublishArgsConfig
  ): void {
    // Map 'overlook-wall' to 'overlook' for MQTT topic (broker uses 'overlook' for state topic)
    const topicExhibit = exhibit === 'overlook-wall' ? 'overlook' : exhibit;
    const message = createMqttMessage(topicExhibit, state);

    console.info(`${exhibit} reporting full state:`, state);
    this.publish(
      `state/${topicExhibit}`,
      JSON.stringify(message),
      { qos: 1, retain: true }, // Retained
      config
    );
  }

  // Docent App → GEC: Request GEC to republish current settings
  public republishSettings(config?: PublishArgsConfig): void {
    const message = createMqttMessage('docent-app', {});

    console.info('Requesting GEC to republish settings');
    this.publish(mqttCommands.docent.republishSettings, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Docent App → GEC: Request sync
  public sendSync(config?: PublishArgsConfig): void {
    const message = createMqttMessage('docent-app', {
      reason: 'manual-sync',
    });

    console.info('Sending sync command to GEC');
    this.publish(mqttCommands.docent.sync, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Docent App → Overlook: Toggle presentation mode (no beat-id)
  public setPresentationMode(exhibit: 'overlook-wall', presentationMode: boolean, config?: PublishArgsConfig): void {
    const message = createMqttMessage('docent-app', {
      'presentation-mode': presentationMode,
    });

    console.info(`Sending presentation-mode to ${exhibit}: ${presentationMode}`);
    this.publish(`cmd/dev/${exhibit}/goto-beat`, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Docent App → Exhibit: Set mute unmute for an exhibit
  public setVolume(subject: 'basecamp' | 'overlook-wall' | 'summit', muted: boolean, config?: PublishArgsConfig): void {
    const volumeLevel = muted ? 0 : 1.0;

    const message = createMqttMessage('docent-app', {
      'volume-level': volumeLevel,
    });

    console.info(`Setting volume for ${subject}: ${muted ? 'muted' : 'unmuted'} (volume-level: ${volumeLevel})`);
    this.publish(`cmd/dev/${subject}/set-volume`, JSON.stringify(message), { qos: 1, retain: false }, config);
  }

  // Custom subscription methods for route-specific topics
  public subscribeToTopic(topic: string, handler: (message: Buffer) => void): void {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, new Set());
      // Only subscribe to the broker if this is the first handler for this topic
      this.client?.subscribe(topic, err => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.info(`Subscribed to custom topic: ${topic}`);
        }
      });
    }
    this.messageHandlers.get(topic)?.add(handler);
  }

  public unsubscribeFromTopic(topic: string, handler?: (message: Buffer) => void): void {
    const handlers = this.messageHandlers.get(topic);
    if (!handlers) return;

    if (handler) {
      handlers.delete(handler);
    } else {
      // If no specific handler provided, remove all (fallback behavior, though usually we want to be specific)
      handlers.clear();
    }

    if (handlers.size === 0) {
      this.messageHandlers.delete(topic);
      this.client?.unsubscribe(topic, err => {
        if (err) {
          console.error(`Failed to unsubscribe from ${topic}:`, err);
        } else {
          console.info(`Unsubscribed from custom topic: ${topic}`);
        }
      });
    }
  }
}
