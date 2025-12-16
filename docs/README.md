## Docs

This folder contains project-wide documentation.

- **Architecture**: `docs/architecture.md`
- **Patterns**: `docs/patterns.md`
- **Audio (per-app scaffold)**: `docs/audio.md`

---

## Audio quickstart

The full guide is in `docs/audio.md`. This section is the fastest path to adopting audio inside any route-folder “app”.

### Provider wiring (required)

Make sure your app layout wraps content like this:

```tsx
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MqttProvider topic="basecamp">
      <AudioProvider appId="basecamp">
        {children}
      </AudioProvider>
    </MqttProvider>
  );
}
```

- `MqttProvider` provides the MQTT client.
- `AudioProvider` binds master volume/mute to `state/<appId>` (`volume-level`, `volume-muted`).

### Play a sound effect (SFX)

```tsx
'use client';

import { useSfx } from '@/components/providers/audio-provider';

export function ExampleButton() {
  const { playSfx } = useSfx();

  return (
    <button
      onClick={() => {
        playSfx('/audio/sfx/click.mp3');
      }}
    >
      Click
    </button>
  );
}
```

### Start a looping music bed

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

### Autoplay behavior

Audio won’t start until the user interacts with the page. The provider auto-unlocks on first `pointerdown` or `keydown`.

If you need to unlock earlier (e.g. on a “Start experience” button), call:

- `useAudio().unlock()`

---

## Adding audio assets

This repo doesn’t currently commit audio assets. The recommended convention is:

- `public/audio/music/*`
- `public/audio/ambience/*`
- `public/audio/sfx/*`

Then reference them as `"/audio/..."`.
