# MQTT Environment Isolation

## Overview

All environments (local, preview, production) can share the same MQTT broker infrastructure while maintaining complete
isolation through environment-prefixed topics.

## How It Works

### Topic Prefixing

All MQTT topics are automatically prefixed with the current environment:

**Before (cross-environment interference):**

```
cmd/dev/all/load-tour
cmd/dev/all/end-tour
state/kiosk-01
```

**After (isolated per environment):**

```
cmd/local/all/load-tour      → Local development
cmd/preview/all/load-tour    → Vercel PR previews
cmd/production/all/load-tour → Production
```

### Environment Configuration

Set `NEXT_PUBLIC_ENVIRONMENT` in your deployment:

| Environment    | Value             | Where to Set                                           |
| -------------- | ----------------- | ------------------------------------------------------ |
| **Local**      | `local` (default) | `.env.local` file or omit (auto-defaults)              |
| **Preview**    | `preview`         | Vercel → Settings → Environment Variables → Preview    |
| **Production** | `production`      | Vercel → Settings → Environment Variables → Production |

## Setup Instructions

### 1. Local Development

Add to your `.env.local`:

```env
NEXT_PUBLIC_ENVIRONMENT=local
```

Or omit it - the code defaults to `local` if not set.

### 2. Vercel Configuration

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_ENVIRONMENT`:
   - **Production** environment: Set value to `production`
   - **Preview** environment: Set value to `preview`
   - **Development** environment: Leave unset or set to `local`

### 3. Verify Isolation

You can verify the environment is isolated by checking the console logs when MQTT messages are sent/received. They'll
show the full topic path including the environment prefix.

## Architecture Impact

### Command Topics

All command topics are now environment-specific:

```typescript
// Local docent sends:
cmd/local/all/load-tour → Only local exhibits receive

// Preview docent sends:
cmd/preview/all/load-tour → Only preview exhibits receive

// Production docent sends:
cmd/production/all/load-tour → Only production exhibits receive
```

### State Topics

Exhibit state reporting is also isolated:

```typescript
state/local/kiosk-01      → Local kiosk state
state/preview/kiosk-01    → Preview kiosk state
state/production/kiosk-01 → Production kiosk state
```

### Availability Topics

Device availability is environment-scoped:

```typescript
state/local/kiosk-01/availability
state/preview/kiosk-01/availability
state/production/kiosk-01/availability
```

## Benefits

✅ **Same broker infrastructure** - No need for separate brokers per environment ✅ **Complete isolation** - Local
testing won't affect production ✅ **PR preview safety** - Each preview is isolated from production and other previews
✅ **Cost effective** - One broker serves all environments ✅ **Easy debugging** - Clear environment prefix in all topic
names

## Migration Notes

### Breaking Change

This is a **breaking change** if you have existing MQTT subscribers expecting the old topic format (`cmd/dev/...`).

**Action Required:**

1. Set `NEXT_PUBLIC_ENVIRONMENT` in all Vercel environments
2. Update any external MQTT subscribers (if any) to use the new topic format
3. Verify docent app and all exhibits are using the same environment value

### Backward Compatibility

The code defaults to `local` environment if `NEXT_PUBLIC_ENVIRONMENT` is not set, providing a safe fallback for
development.

## Troubleshooting

### Issue: Local signals still affecting production

**Cause:** Both environments using the same `NEXT_PUBLIC_ENVIRONMENT` value

**Fix:** Verify Vercel environment variables are set correctly:

- Production should be `production`
- Preview should be `preview`
- Local `.env.local` should be `local` or omitted

### Issue: Exhibits not receiving commands

**Cause:** Docent and exhibits using different environment values

**Fix:** Ensure both docent app and exhibits have matching `NEXT_PUBLIC_ENVIRONMENT` values for each environment.

### Issue: Can't see MQTT messages

**Check:** Open browser console and look for log messages showing topic names with environment prefixes.

## Related Files

- `src/lib/mqtt/constants.ts` - Environment detection and topic generation
- `src/lib/mqtt/utils/mqtt-service.ts` - State reporting with environment prefix
- `src/lib/mqtt/utils/get-availability-topic.ts` - Availability topic generation
