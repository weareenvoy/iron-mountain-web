# 🚀 MQTT Environment Isolation - Setup Guide

## ✅ What Was Implemented

Environment-prefixed MQTT topics now ensure complete isolation between local, preview, and production environments even
when sharing the same MQTT broker.

### Changes Made

1. **Added environment detection** (`getMqttEnvironment()`)
2. **Prefixed all command topics**: `cmd/local/all/...`, `cmd/preview/all/...`, `cmd/production/all/...`
3. **Prefixed all state topics**: `state/local/kiosk-01`, `state/preview/kiosk-01`, etc.
4. **Updated availability topics** with environment prefixes
5. **Documentation** added in `docs/mqtt-environment-isolation.md`

## 🎯 Next Steps - Vercel Configuration

### 1. Add Environment Variable in Vercel

Go to: **https://vercel.com/[your-team]/iron-mountain-web/settings/environment-variables**

Add the following variable:

| Variable Name             | Production Value | Preview Value | Development Value |
| ------------------------- | ---------------- | ------------- | ----------------- |
| `NEXT_PUBLIC_ENVIRONMENT` | `production`     | `preview`     | `local`           |

#### How to Add:

1. Click **"Add New"**
2. Enter key: `NEXT_PUBLIC_ENVIRONMENT`
3. Select environments to apply:
   - ✅ **Production** → Enter value: `production`
   - ✅ **Preview** → Enter value: `preview`
   - ⬜ **Development** (leave unchecked, defaults to `local`)
4. Click **Save**

### 2. Redeploy

After adding the environment variable, you need to redeploy:

- **Production**: Redeploy from the Deployments tab
- **Preview**: New PRs will automatically use the new variable
- **Existing PRs**: May need to push a new commit to trigger rebuild

### 3. Verify Isolation

#### Test in Browser Console:

Open your deployed apps and check the console logs when MQTT connects:

**Local (http://localhost:3000):**

```
Topics will show: cmd/local/all/load-tour
```

**Preview (https://your-pr-preview.vercel.app):**

```
Topics will show: cmd/preview/all/load-tour
```

**Production (https://your-production.vercel.app):**

```
Topics will show: cmd/production/all/load-tour
```

## 🔍 How to Test

### Before Deploy (Local):

1. Add to your `.env.local`:

   ```env
   NEXT_PUBLIC_ENVIRONMENT=local
   ```

2. Start your local dev server:

   ```bash
   pnpm dev
   ```

3. Open browser console and look for MQTT connection logs - topics should show `cmd/local/...`

### After Deploy:

1. Open a PR → Check preview deployment
2. Open browser console on preview
3. Send a load-tour command from local docent
4. Verify preview exhibits **DO NOT** respond (they're on `preview` topics, not `local`)

## ⚠️ Important Notes

### Breaking Change

This is a **breaking change** for MQTT topics. After deploying:

- ✅ **Same environment devices** can communicate (local ↔ local, prod ↔ prod)
- ❌ **Different environment devices** cannot communicate (local ↔ prod blocked)

### All Devices Must Update

Ensure these are all deployed with the same environment value:

- Docent app
- All kiosks (1, 2, 3)
- Basecamp
- Summit
- Overlook wall
- Welcome wall

### Rollback Plan

If you need to rollback:

1. Remove `NEXT_PUBLIC_ENVIRONMENT` from Vercel
2. Topics will default to `local` environment
3. Redeploy affected environments

## 📊 Before vs After

### Before:

```
Local docent sends: cmd/dev/all/load-tour
   ↓
   └─→ Local kiosks receive ✅
   └─→ Preview kiosks receive ❌ (UNINTENDED!)
   └─→ Production kiosks receive ❌ (DANGEROUS!)
```

### After:

```
Local docent sends: cmd/local/all/load-tour
   ↓
   └─→ Local kiosks receive ✅
   └─→ Preview kiosks ignore (different topic)
   └─→ Production kiosks ignore (different topic)

Production docent sends: cmd/production/all/load-tour
   ↓
   └─→ Local kiosks ignore (different topic)
   └─→ Preview kiosks ignore (different topic)
   └─→ Production kiosks receive ✅
```

## 🆘 Troubleshooting

### Issue: Local still affecting production

**Solution:** Check that both have different `NEXT_PUBLIC_ENVIRONMENT` values set in Vercel.

### Issue: Commands not being received

**Solution:** Verify all devices in the same environment have matching `NEXT_PUBLIC_ENVIRONMENT` values.

### Issue: Variable not taking effect

**Solution:** Redeploy the affected environment after adding the variable.

## 📝 Files Changed

- ✅ `src/lib/mqtt/constants.ts` - Added environment detection and prefixing
- ✅ `src/lib/mqtt/utils/mqtt-service.ts` - Updated state reporting
- ✅ `src/lib/mqtt/utils/get-availability-topic.ts` - Updated availability topics
- ✅ `README.md` - Added environment variable documentation
- ✅ `docs/mqtt-environment-isolation.md` - Detailed technical docs
- ✅ `MQTT-ENVIRONMENT-SETUP.md` - This setup guide

---

**Ready to proceed?** Once you've added the Vercel environment variable and redeployed, your environments will be fully
isolated! 🎉
