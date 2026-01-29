#!/bin/bash
# Launch Chrome in kiosk mode with audio autoplay enabled
# Usage: ./scripts/launch-kiosk.sh [kiosk-1|kiosk-2|kiosk-3]

# Default to kiosk-2 if no argument provided
KIOSK_ID=${1:-kiosk-2}

# Port where Next.js dev/prod server is running
PORT=${PORT:-3000}

# Build the URL
URL="http://localhost:${PORT}/${KIOSK_ID}"

echo "========================================"
echo "Launching Chrome in Kiosk Mode"
echo "========================================"
echo "Kiosk: ${KIOSK_ID}"
echo "URL: ${URL}"
echo "Port: ${PORT}"
echo ""
echo "Features enabled:"
echo "  ✓ Kiosk mode (fullscreen, no UI)"
echo "  ✓ Audio autoplay without user gesture"
echo "  ✓ Isolated user data directory"
echo "========================================"
echo ""

# Kill any existing Chrome processes using this user data dir
pkill -f "chrome_kiosk_${KIOSK_ID}" 2>/dev/null || true

# Wait a moment for processes to close
sleep 1

# Detect OS and set Chrome path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
        CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    elif [ -f "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
        CHROME_PATH="/Applications/Chromium.app/Contents/MacOS/Chromium"
    else
        echo "❌ Error: Chrome or Chromium not found in /Applications"
        echo "Please install Chrome or Chromium"
        exit 1
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v google-chrome &> /dev/null; then
        CHROME_PATH="google-chrome"
    elif command -v chromium-browser &> /dev/null; then
        CHROME_PATH="chromium-browser"
    elif command -v chromium &> /dev/null; then
        CHROME_PATH="chromium"
    else
        echo "❌ Error: Chrome or Chromium not found"
        echo "Install with: sudo apt install chromium-browser"
        exit 1
    fi
else
    echo "❌ Error: Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Using Chrome: ${CHROME_PATH}"
echo ""
echo "⚠️  IMPORTANT: Make sure ALL Chrome windows are closed first!"
echo "   Press Ctrl+C to cancel if you need to close Chrome"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Launch Chrome with kiosk flags
# Note: Multiple autoplay-related flags to maximize compatibility
"${CHROME_PATH}" \
  --kiosk \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir="/tmp/chrome_kiosk_${KIOSK_ID}" \
  --disable-features=TranslateUI,AudioServiceOutOfProcess \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-component-update \
  --noerrdialogs \
  --disable-hang-monitor \
  --disable-web-security \
  --allow-running-insecure-content \
  --unsafely-treat-insecure-origin-as-secure="http://localhost:${PORT}" \
  --simulate-outdated-no-au='Tue, 31 Dec 2099 23:59:59 GMT' \
  "${URL}" &

CHROME_PID=$!

echo ""
echo "========================================"
echo "✅ Chrome launched in kiosk mode (PID: ${CHROME_PID})"
echo "========================================"
echo ""
echo "If audio still doesn't work:"
echo "1. Quit Chrome completely (Cmd+Q)"
echo "2. Run: rm -rf /tmp/chrome_kiosk_*"
echo "3. Re-run this script"
echo ""
echo "To stop: kill ${CHROME_PID}"
echo ""
