import type { IClientOptions } from 'mqtt';

export const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'mqtt://localhost:1883';

export const MQTT_BASE_OPTIONS: Omit<IClientOptions, 'clientId' | 'will'> = {
  clean: false,
  keepalive: 30,
  // connectTimeout: 2 * 1000,
};

export const mqttCommands = {
  basecamp: {
    gotoBeat: 'cmd/dev/basecamp/goto-beat',
  },
  docent: {
    endTour: 'cmd/dev/all/end-tour',
    loadTour: 'cmd/dev/gec/load-tour',
    republishSettings: 'cmd/dev/gec/republish-settings',
    setVolume: 'cmd/dev/gec/set-volume',
    sync: 'cmd/dev/gec/sync',
  },
  overlook: {
    gotoBeat: 'cmd/dev/overlook/goto-beat',
  },
  summit: {
    gotoBeat: 'cmd/dev/summit/goto-beat',
  },
};
