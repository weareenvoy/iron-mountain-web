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

/**
 * Valid MQTT environment values for topic isolation.
 */
export type MqttEnvironment = 'local' | 'preview' | 'production';

/**
 * Array of valid MQTT environments for validation.
 */
export const MQTT_ENVIRONMENTS: readonly MqttEnvironment[] = ['local', 'preview', 'production'] as const;

/**
 * Track if environment has been logged to avoid spam.
 * Only logs once per process lifecycle.
 */
let environmentLogged = false;

/**
 * Get the current environment for MQTT topic isolation.
 * - Production: 'production' (Vercel production deployments)
 * - Preview: 'preview' (Vercel PR preview deployments)
 * - Local: 'local' (local development, default)
 *
 * This ensures MQTT messages are isolated per environment even when sharing
 * the same broker infrastructure.
 *
 * @throws {Error} If NEXT_PUBLIC_MQTT_STRICT_MODE=true and environment is invalid
 */
export const getMqttEnvironment = (): MqttEnvironment => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const strictMode = process.env.NEXT_PUBLIC_MQTT_STRICT_MODE === 'true';

  // Validate environment value
  if (env !== undefined && !MQTT_ENVIRONMENTS.includes(env as MqttEnvironment)) {
    const errorMsg = `[MQTT Environment] ❌ Invalid NEXT_PUBLIC_ENVIRONMENT: "${env}". Must be one of: ${MQTT_ENVIRONMENTS.join(', ')}`;
    console.error(errorMsg);

    // Strict mode throws error instead of defaulting
    if (strictMode) {
      throw new Error(errorMsg);
    }
  }

  // Determine resolved environment
  const resolvedEnv: MqttEnvironment = MQTT_ENVIRONMENTS.includes(env as MqttEnvironment)
    ? (env as MqttEnvironment)
    : 'local';

  // Warn if environment not explicitly set
  if (env === undefined) {
    const warnMsg =
      '[MQTT Environment] ⚠️  NEXT_PUBLIC_ENVIRONMENT not set, defaulting to "local". Set this in Vercel environment variables for production/preview.';
    console.warn(warnMsg);

    // Strict mode throws error for missing env var
    if (strictMode) {
      throw new Error('[MQTT Environment] NEXT_PUBLIC_ENVIRONMENT is required when NEXT_PUBLIC_MQTT_STRICT_MODE=true');
    }
  }

  // Log environment once on first call for observability
  if (!environmentLogged) {
    const wasDefaulted = env === undefined || !MQTT_ENVIRONMENTS.includes(env as MqttEnvironment);
    const emoji = resolvedEnv === 'production' ? '🏭' : resolvedEnv === 'preview' ? '🔍' : '💻';
    console.info(
      `${emoji} [MQTT Environment] ${resolvedEnv.toUpperCase()}${wasDefaulted ? ' (defaulted)' : ''} | Topics: cmd/${resolvedEnv}/... | State: state/${resolvedEnv}/...`
    );
    environmentLogged = true;
  }

  return resolvedEnv;
};

export const MQTT_BASE_OPTIONS: Readonly<Omit<IClientOptions, 'clientId' | 'will'>> = {
  clean: false,
  keepalive: 30,
  reconnectPeriod: 2000,
  // connectTimeout: 2 * 1000,
} as const;

/**
 * Get MQTT command topics with environment isolation.
 * Topics are prefixed with environment (local/preview/production) to prevent
 * cross-environment interference when sharing the same broker.
 */
export const getMqttCommands = () => {
  const env = getMqttEnvironment();
  return {
    basecamp: {
      gotoBeat: `cmd/${env}/basecamp/goto-beat`,
    },
    broadcast: {
      endTour: `cmd/${env}/all/end-tour`,
      goIdle: `cmd/${env}/all/go-idle`,
      loadTour: `cmd/${env}/all/load-tour`,
    },
    docent: {
      endTour: `cmd/${env}/all/end-tour`,
      loadTour: `cmd/${env}/gec/load-tour`,
      republishSettings: `cmd/${env}/gec/republish-settings`,
      sync: `cmd/${env}/gec/sync`,
    },
    overlook: {
      gotoBeat: `cmd/${env}/overlook/goto-beat`,
    },
    summit: {
      gotoBeat: `cmd/${env}/summit/goto-beat`,
    },
    welcomeWall: {
      endTour: `cmd/${env}/all/end-tour`,
      loadTour: `cmd/${env}/all/load-tour`,
    },
  } as const;
};

/**
 * Singleton instance of MQTT commands for the current environment.
 * Lazily initialized on first access.
 */
export const mqttCommands = getMqttCommands();

/**
 * Get MQTT state topics with environment isolation.
 * State topics are prefixed with environment to isolate state reporting.
 */
export const getMqttStateTopics = () => {
  const env = getMqttEnvironment();
  return {
    basecamp: `state/${env}/basecamp`,
    gec: `state/${env}/gec`,
    summit: `state/${env}/summit`,
    sync: `state/${env}/sync`,
    welcomeWall: `state/${env}/welcome-wall`,
  } as const;
};

/**
 * Singleton instance of MQTT state topics for the current environment.
 * Lazily initialized on first access.
 */
export const mqttStateTopics = getMqttStateTopics();
