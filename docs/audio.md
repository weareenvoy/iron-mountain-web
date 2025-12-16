## Audio architecture (per-route “apps”)

This repo now includes a lightweight audio layer that each route-folder “app” can opt into **without** forcing a single
audio implementation style.

- **Where**: `src/lib/audio/*` (engine + types) and `src/components/providers/audio-provider.tsx` (React provider +
  hooks)
- **Goal**: give each app owner a consistent way to:
  - play **SFX** (button clicks, animation hits)
  - run **loops** (BGM, ambience beds)
  - respond to **Docent → MQTT** mute/volume controls per exhibit

This is intentionally a **scaffold**: it’s production-safe and works today, but it’s designed so each app can adopt it
incrementally.

---

## Mental model

### Two layers

- **`AudioEngine`** (`src/lib/audio/audio-engine.ts`)
  - Imperative Web Audio wrapper.
  - Has a **master** volume/mute and **three channels**: `music`, `ambience`, `sfx`.
  - Supports:
    - `playSfx(url)` one-shots
    - `setMusic(url | null)` loop with fade
    - `setAmbience(url | null)` loop with fade
  - Handles autoplay restrictions by queuing actions until audio is “unlocked”.

- **`AudioProvider`** (`src/components/providers/audio-provider.tsx`)
  - Client-only React context.
  - Creates an `AudioEngine` per “app” and exposes hooks.
  - Binds MQTT → audio settings by subscribing to **`state/<appId>`** and applying:
    - `volume-muted` → `AudioEngine.setMasterMuted(...)`
    - `volume-level` → `AudioEngine.setMasterVolume(...)`

### Channels

- **`music`**: background music loops
- **`ambience`**: baked SFX beds / backgrounds
- **`sfx`**: one-shots triggered by UI and coded animations

Each channel has a gain and can be muted independently (the UI for that is not implemented yet, but the engine supports
it).

---

## MQTT contract (Docent control plane)

### Source of truth

For a display exhibit, MQTT state is published to:

- `state/basecamp`
- `state/overlook`
- `state/summit`

The state shape is already modeled in `src/lib/mqtt/types.ts`:

- `volume-muted: boolean`
- `volume-level: number` (0..1)

### What this code does

When `AudioProvider` is mounted with `appId="basecamp" | "overlook" | "summit"`, it subscribes to `state/<appId>` and
applies the latest retained + live updates to the master gain.

### Important behavior note

Some apps also **report** their own MQTT state periodically (e.g., Basecamp). If the app stops listening after “boot
state”, it can accidentally overwrite later mute updates.

To avoid this, exhibits should keep listening to `state/<appId>` (retained + live updates) so Docent-driven mute stays
sticky.

---

## How to use it in an app

### 1) Wrap your app layout

Your display route layouts already wrap with `MqttProvider`. Add `AudioProvider` beneath it.

Example (`src/app/(displays)/basecamp/layout.tsx`):

```tsx
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

export default function BasecampLayout({ children }: LayoutProps<'/basecamp'>) {
  return (
    <MqttProvider topic="basecamp">
      <AudioProvider appId="basecamp">
        {children}
      </AudioProvider>
    </MqttProvider>
  );
}
```

This project already applies this pattern to:

- Basecamp
- Overlook
- Summit

### 2) Play SFX

```tsx
'use client';

import { useSfx } from '@/components/providers/audio-provider';

export function NextButton() {
  const { playSfx } = useSfx();

  return (
    <button
      onClick={() => {
        playSfx('/audio/sfx/click.mp3');
      }}
    >
      Next
    </button>
  );
}
```

Notes:

- The engine uses `fetch()` + `decodeAudioData()` and caches buffers by URL.
- Calling `playSfx` before user gesture is OK: it queues until unlock.

### 3) Start/stop background music loop

```tsx
'use client';

import { useEffect } from 'react';
import { useMusic } from '@/components/providers/audio-provider';

export function MusicBed() {
  const { setMusic } = useMusic();

  useEffect(() => {
    setMusic('/audio/music/bgm-1.mp3', { fadeMs: 500, volume: 0.8 });

    return () => {
      setMusic(null, { fadeMs: 250 });
    };
  }, [setMusic]);

  return null;
}
```

### 4) Start/stop ambience loop

```tsx
'use client';

import { useEffect } from 'react';
import { useAmbience } from '@/components/providers/audio-provider';

export function AmbienceBed() {
  const { setAmbience } = useAmbience();

  useEffect(() => {
    setAmbience('/audio/ambience/ambient-loop-1.mp3', { fadeMs: 300, volume: 0.6 });

    return () => {
      setAmbience(null, { fadeMs: 200 });
    };
  }, [setAmbience]);

  return null;
}
```

---

## Using audio in coded animations

You mentioned “SFX triggered by coded animations” (e.g., a transition out / in). The hook pattern here is:

- your animation timeline emits events
- you call `playSfx(...)` at the exact moments

Example with a toy interval timeline:

```tsx
'use client';

import { useEffect } from 'react';
import { useSfx } from '@/components/providers/audio-provider';

export function ExampleTimeline() {
  const { playSfx } = useSfx();

  useEffect(() => {
    const t1 = window.setTimeout(() => playSfx('/audio/sfx/transition-out.mp3'), 250);
    const t2 = window.setTimeout(() => playSfx('/audio/sfx/transition-in.mp3'), 900);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [playSfx]);

  return null;
}
```

If you’re using a real animation library (Framer Motion, GSAP, etc.), you’d call `playSfx` from the same callback/hook
you use to coordinate frame-accurate transitions.

---

## Reading current settings (for UI/debug)

`useAudioSettings()` returns the current computed settings snapshot from the engine.

```tsx
'use client';

import { useAudioSettings } from '@/components/providers/audio-provider';

export function AudioDebug() {
  const settings = useAudioSettings();

  return (
    <pre style={{ fontSize: 12 }}>
      {JSON.stringify(settings, null, 2)}
    </pre>
  );
}
```

---

## Where should audio files live?

This repo currently has no audio assets committed. The simplest convention is:

- `public/audio/music/*`
- `public/audio/ambience/*`
- `public/audio/sfx/*`

Then reference them as `"/audio/..."` in code.

---

## Autoplay / “unlock” behavior

Browsers require a user gesture before audio can start.

`AudioProvider` listens for the first `pointerdown` or `keydown` and calls `engine.unlock()`.

- Calls to `playSfx`/`setMusic`/`setAmbience` **before unlock** are queued.
- Once unlocked, queued actions run.

If you ever need to unlock earlier (e.g., on a “Start experience” button), just call `useAudio().unlock()`.

---

## Current limitations (intentional)

- **No asset registry yet**: everything is URL-based (`/audio/...`).
- **No per-channel MQTT control** yet: MQTT drives master mute/volume only.
- **No “ducking”** (e.g., lower music while a voiceover plays).
- **No stop-all / cleanup API** exposed yet.

These are straightforward follow-ups once the apps start adopting the scaffold.

---

## Suggested next steps

- Add a small `public/audio/` sample set (even 1 file per channel) so it’s easy to test locally.
- Add a thin “audio asset map” per app (Basecamp/Summit/Overlook) so app owners can reference semantic IDs instead of
  raw URLs.
- Decide whether MQTT should stay master-only or expand to per-channel control.
