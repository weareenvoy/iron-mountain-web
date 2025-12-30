# Kiosk Provider

The `KioskProvider` follows the same context provider pattern used by Basecamp and Summit exhibits. It provides
centralized data fetching and state management for kiosk displays.

**Note**: Unlike Basecamp and Summit, kiosks are standalone displays and do **not** use MQTT or Docent control.

## Architecture

```
Layout (per kiosk)
  ↓
KioskProvider (data + state)
  ↓
View Component (renders slides)
```

## Features

- **Data fetching**: Loads kiosk JSON data from `/api/<kioskId>.json` (ex: `/api/kiosk-2.json`) with online API
  fallback.
- **Resilience**: Times out quickly and falls back to static JSON if the API is unavailable/offline.
- **Standalone**: No MQTT or Docent integration (kiosks operate independently).
- **State management**: Provides `data`, `error`, `kioskId`, `loading`, `refetch`.

## Usage

### 1. Wrap layout with KioskProvider

```tsx
// layout.tsx
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk3Layout = ({ children }: LayoutProps) => {
  return <KioskProvider kioskId="kiosk-3">{children}</KioskProvider>;
};
```

### 2. Use the hook in your view

```tsx
// Kiosk3View.tsx
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk3View = () => {
  const { data, error, loading, refetch } = useKiosk();

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState error={error} />;

  // Access kiosk data
  // Note: `KioskData` is intentionally flexible (kiosk-1 nested vs kiosk-2/3 flat).
  // Your view/template layer is responsible for mapping/parsing the sections it needs.
  const challenges = data.challenges ?? data.challenge;
  const customInteractive = data.customInteractive;
  const solutions = data.solutions;
  const value = data.value;

  return <div>{/* render slides */}</div>;
};
```

## Data Structure

`getKioskData(kioskId)` follows the same convention as the other `get-*` utilities and returns:

- `data`: the locale-selected kiosk payload
- `locale`: the locale used (selected via `getLocaleForTesting()` today)

The `KioskData` type is intentionally flexible to support multiple kiosk schemas:

```typescript
interface KioskData {
  // Kiosk 2/3 flat structure (varies by kiosk)
  readonly ambient?: unknown;
  readonly challenge?: unknown;
  readonly challenges?: unknown;

  // Kiosk 1 nested structure
  readonly data?: {
    readonly ambient?: unknown;
    readonly challenge?: unknown;
    readonly customInteractive?: unknown;
    readonly solutions?: unknown;
    readonly value?: unknown;
  };

  readonly customInteractive?: unknown;
  readonly solutions?: unknown;
  readonly value?: unknown;
}
```

## Comparison with other exhibits

| Feature      | Basecamp              | Summit                | Kiosks                |
| ------------ | --------------------- | --------------------- | --------------------- |
| Data source  | `/api/basecamp.json`  | `/api/summit.json`    | `/api/<kioskId>.json` |
| Navigation   | `beatIdx`, `momentId` | `beatIdx`, `momentId` | `slideIndex`          |
| MQTT control | ✅ Yes (Docent)       |                       | ❌ No (standalone)    |
| Hook         | `useBasecamp()`       | `useSummit()`         | `useKiosk()`          |
| Provider     | `BasecampProvider`    | `SummitProvider`      | `KioskProvider`       |

## Benefits

✅ **Consistent pattern** across all exhibits (Basecamp, Summit, Kiosks) ✅ **Centralized data loading** with
loading/error states ✅ **Type-safe** data access ✅ **Resilient** with API fallback ✅ **No more direct JSON imports**
in view components ✅ **Standalone operation** - no MQTT/Docent dependencies ✅ **Simplified architecture** - just
data + state management
