#!/bin/bash
# macOS-specific Chrome kiosk launcher that FORCES autoplay
# This script uses additional workarounds for macOS restrictions

KIOSK_ID=${1:-kiosk-2}
PORT=${PORT:-3000}
URL="http://localhost:${PORT}/${KIOSK_ID}"

echo "========================================"
echo "macOS Chrome Kiosk Launcher"
echo "========================================"

# 1. Completely quit Chrome
echo "Step 1: Quitting all Chrome instances..."
osascript -e 'quit app "Google Chrome"' 2>/dev/null || true
osascript -e 'quit app "Chromium"' 2>/dev/null || true
sleep 2

# 2. Clear the kiosk user data to reset autoplay policy
echo "Step 2: Clearing kiosk user data..."
rm -rf "/tmp/chrome_kiosk_${KIOSK_ID}"

# 3. Detect Chrome
if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [ -f "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
    CHROME_PATH="/Applications/Chromium.app/Contents/MacOS/Chromium"
else
    echo "❌ Chrome not found"
    exit 1
fi

echo "Step 3: Launching Chrome with maximum autoplay permissions..."
echo ""
echo "Chrome: ${CHROME_PATH}"
echo "URL: ${URL}"
echo ""

# 4. Launch with EVERY autoplay flag that might help
"${CHROME_PATH}" \
  --kiosk \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir="/tmp/chrome_kiosk_${KIOSK_ID}" \
  --disable-features=AudioServiceOutOfProcess \
  --disable-web-security \
  --allow-running-insecure-content \
  --disable-site-isolation-trials \
  --disable-features=IsolateOrigins,site-per-process \
  --no-first-run \
  --no-default-browser-check \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-component-update \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --disable-background-timer-throttling \
  --disable-ipc-flooding-protection \
  --autoplay-policy=no-user-gesture-required \
  "${URL}" > /tmp/chrome_kiosk_${KIOSK_ID}.log 2>&1 &

CHROME_PID=$!

echo "✅ Chrome launched (PID: ${CHROME_PID})"
echo ""
echo "Log file: /tmp/chrome_kiosk_${KIOSK_ID}.log"
echo ""
echo "========================================"
echo "Testing autoplay..."
echo "========================================"
echo ""
echo "Wait 5 seconds for the page to load, then check if audio plays"
echo "when MQTT dismisses the idle video."
echo ""
echo "If audio STILL doesn't work:"
echo "  This is a macOS limitation. Audio will work on Linux kiosks."
echo "  For development, click the idle screen first."
echo ""
echo "To stop: kill ${CHROME_PID}"
echo ""
