# Kiosk Provider

The `KioskProvider` follows the same context provider pattern used by Basecamp and Summit exhibits. It provides centralized data fetching and state management for kiosk displays.

**Note**: Unlike Basecamp and Summit, kiosks are standalone displays and do **not** use MQTT or Docent control.

## Architecture

```
Layout (per kiosk)
  ↓
KioskProvider (data + state)
  ↓
KioskControllerProvider (slide navigation)
  ↓
View Component (renders slides)
```

## Features

- **Data Fetching**: Loads kiosk JSON data from `/api/kiosk-{1,2,3}.json`
- **State Management**: Provides `data`, `loading`, `error`, `slideIndex`
- **Resilience**: Online API fallback with static JSON backup
- **Standalone**: No MQTT or Docent integration (kiosks operate independently)

## Usage

### 1. Wrap layout with KioskProvider

```tsx
// layout.tsx
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers';

const Kiosk3Layout = ({ children }: LayoutProps) => {
  return (
    <KioskProvider kioskId="kiosk-3">
      <KioskControllerProvider kioskId="kiosk-3">
        {children}
      </KioskControllerProvider>
    </KioskProvider>
  );
};
```

### 2. Use the hook in your view

```tsx
// Kiosk3View.tsx
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers';

const Kiosk3View = () => {
  const { data, loading, error, slideIndex, setSlideIndex } = useKiosk();

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState error={error} />;

  // Access kiosk data
  const challenges = data.challenges;
  const solutions = data.solutions;
  const value = data.value;
  const hardcoded = data.hardcoded;

  // Use slideIndex for navigation
  return <div data-slide-index={slideIndex}>...</div>;
};
```

## Data Structure

The `KioskFullData` type provides the complete kiosk content:

```typescript
interface KioskFullData {
  readonly challenges: KioskChallenges;
  readonly hardcoded?: unknown;
  readonly solutions?: unknown;
  readonly value?: unknown;
}
```

## Comparison with other exhibits

| Feature | Basecamp | Summit | Kiosks |
|---------|----------|--------|--------|
| Data source | `/api/basecamp.json` | `/api/summit.json` | `/api/kiosk-{1,2,3}.json` |
| Navigation | `beatIdx`, `momentId` | `beatIdx`, `momentId` | `slideIndex` |
| MQTT control | ✅ Yes (Docent) | | ❌ No (standalone) |
| Hook | `useBasecamp()` | `useSummit()` | `useKiosk()` |
| Provider | `BasecampProvider` | `SummitProvider` | `KioskProvider` |

## Benefits

✅ **Consistent pattern** across all exhibits (Basecamp, Summit, Kiosks)  
✅ **Centralized data loading** with loading/error states  
✅ **Type-safe** data access  
✅ **Resilient** with API fallback  
✅ **No more direct JSON imports** in view components  
✅ **Standalone operation** - no MQTT/Docent dependencies  
✅ **Simplified architecture** - just data + state management  
