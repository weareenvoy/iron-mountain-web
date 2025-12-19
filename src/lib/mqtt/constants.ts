import type { IClientOptions } from 'mqtt';

/**
 * Build a browser-safe MQTT WebSocket URL.
 * - Prefers NEXT_PUBLIC_MQTT_BROKER_URL if provided.
 * - Defaults to ws://localhost:9001/mqtt (common broker websockets default).
 * - Upgrades to wss if current page is https and the URL host is relative/localhost.
 */
export const getMqttBrokerUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
  if (fromEnv) {
    // Ensure we’re using a ws/wss URL in the browser
    if (fromEnv.startsWith('mqtt://') || fromEnv.startsWith('tcp://')) {
      // Convert known TCP schemes to websockets with a sensible default path
      return fromEnv.replace(/^mqtt:|^tcp:/, 'ws:').replace(/\/?$/, '/mqtt');
    }
    return fromEnv;
  }

  // Default local dev broker over websockets
  const isHttps = typeof window !== 'undefined' ? window.location.protocol === 'https:' : false;
  const scheme = isHttps ? 'wss' : 'ws';
  return `${scheme}://localhost:9001/mqtt`;
};

export const MQTT_BASE_OPTIONS: Readonly<Omit<IClientOptions, 'clientId' | 'will'>> = {
  clean: false,
  keepalive: 30,
  reconnectPeriod: 2000,
  // connectTimeout: 2 * 1000,
} as const;

export const mqttCommands = {
  docent: {
    endTour: 'cmd/dev/all/end-tour',
    loadTour: 'cmd/dev/gec/load-tour',
    republishSettings: 'cmd/dev/gec/republish-settings',
    sync: 'cmd/dev/gec/sync',
  },
} as const;
