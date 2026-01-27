# Kiosk Deployment Guide

## Development Testing

### macOS Development (Current Setup)

⚠️ **Important**: macOS has stricter audio autoplay policies than Linux. Even with Chrome flags, macOS may still require a user interaction before audio can play. This is a macOS limitation, not a code issue.

**For development on macOS**, you have two options:

**Option 1: Accept the click requirement (recommended)**
```bash
# Run dev server normally
pnpm dev

# Open in regular browser
open http://localhost:3000/kiosk-2

# Click the idle screen once to enable audio
# This is fine for development - production Linux kiosks won't need this
```

**Option 2: Try kiosk mode (may still need click on macOS)**
```bash
# Make sure Next.js is running first
pnpm dev

# In a separate terminal, launch Chrome in kiosk mode
./scripts/launch-kiosk-macos.sh kiosk-2
```

### Linux Development/Testing

On Linux, the kiosk mode works perfectly:

```bash
# Launch kiosk mode
./scripts/launch-kiosk.sh kiosk-2

# Audio will play immediately when MQTT dismisses idle - no click needed! ✅
```

## Production Deployment

### Hardware Requirements

**Production Kiosk Specifications (Iron Mountain Exhibition):**
- **Display**: Jupiter Pana 81T (81", 2160x5120 @ 60Hz, portrait orientation)
- **Touch**: Touchscreen enabled
- **Audio**: Mono pendant speaker, DVS
- **PC**: Content PC Mid Speed (3.5GHz CPU, 64GB RAM, 256GB SSD, Nvidia RTX 4000 Ada GPU)
- **Quantity**: 3 kiosks

**Recommended OS**: Ubuntu 22.04 LTS (Long Term Support)
- ✅ Best Chrome autoplay support with flags
- ✅ Stable and well-supported
- ✅ Excellent Nvidia driver support for RTX 4000 Ada
- ✅ Free and open source

**Alternative OS Options**:
- Ubuntu 24.04 LTS (newer, also good)
- Debian 12 (more conservative, very stable)
- Chrome OS Flex (purpose-built for kiosks, but less flexible)

### Production Setup Options

#### Option 1: Systemd Service (Linux - Recommended)

Create `/etc/systemd/system/kiosk-2.service`:

```ini
[Unit]
Description=Iron Mountain Kiosk 2
After=network.target graphical.target

[Service]
Type=simple
User=kiosk
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/kiosk/.Xauthority"
WorkingDirectory=/opt/iron-mountain-web
ExecStartPre=/usr/bin/pnpm build
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=graphical.target
```

Create `/etc/systemd/system/kiosk-2-chrome.service`:

```ini
[Unit]
Description=Chrome Kiosk Browser for Kiosk 2
After=kiosk-2.service
Requires=kiosk-2.service

[Service]
Type=simple
User=kiosk
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/kiosk/.Xauthority"
WorkingDirectory=/opt/iron-mountain-web
ExecStartPre=/bin/sleep 5
ExecStart=/usr/bin/chromium-browser \
  --kiosk \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir=/home/kiosk/.config/chromium-kiosk \
  --disable-features=TranslateUI \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-component-update \
  --noerrdialogs \
  --disable-hang-monitor \
  http://localhost:3000/kiosk-2
Restart=always
RestartSec=5

[Install]
WantedBy=graphical.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable kiosk-2.service kiosk-2-chrome.service
sudo systemctl start kiosk-2.service kiosk-2-chrome.service

# Check status
sudo systemctl status kiosk-2.service
sudo systemctl status kiosk-2-chrome.service

# View logs
sudo journalctl -u kiosk-2.service -f
sudo journalctl -u kiosk-2-chrome.service -f
```

#### Option 2: PM2 + Startup Script (Cross-platform)

**Install PM2:**
```bash
npm install -g pm2
```

**Start the Next.js app:**
```bash
cd /opt/iron-mountain-web
pnpm build
pm2 start pnpm --name "kiosk-2-app" -- start
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

**Create Chrome autostart:**

For Linux (add to `~/.config/autostart/kiosk-2.desktop`):
```desktop
[Desktop Entry]
Type=Application
Name=Kiosk 2 Chrome
Exec=/opt/iron-mountain-web/scripts/launch-kiosk.sh kiosk-2
Terminal=false
X-GNOME-Autostart-enabled=true
```

For macOS (create `~/Library/LaunchAgents/com.ironmountain.kiosk2.plist`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ironmountain.kiosk2</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/iron-mountain-web/scripts/launch-kiosk.sh</string>
        <string>kiosk-2</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.ironmountain.kiosk2.plist
```

#### Option 3: Docker + Docker Compose (Advanced)

Create `docker-compose.kiosk.yml`:

```yaml
version: '3.8'

services:
  kiosk-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_MQTT_BROKER_URL=${MQTT_BROKER_URL}
    restart: unless-stopped

  kiosk-browser:
    image: selenium/standalone-chromium:latest
    ports:
      - "4444:4444"
      - "7900:7900"  # VNC for debugging
    environment:
      - SE_OPTS=--kiosk http://kiosk-app:3000/kiosk-2
      - START_XVFB=true
      - SCREEN_WIDTH=1920
      - SCREEN_HEIGHT=1080
    depends_on:
      - kiosk-app
    restart: unless-stopped
```

### Environment Variables

Production `.env.production`:
```env
# MQTT Configuration
NEXT_PUBLIC_MQTT_BROKER_URL=wss://your-mqtt-broker.com
NEXT_PUBLIC_USE_GEC=true

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.ironmountain.com
NEXT_PUBLIC_CDN_HOST_NAME=https://cdn.ironmountain.com

# Kiosk Configuration
NEXT_PUBLIC_KIOSK_OFFLINE_FIRST=true
NODE_ENV=production
```

### Kiosk Hardware Configuration

**Recommended Linux Setup (Ubuntu 22.04 LTS):**

```bash
# 1. Fresh Ubuntu 22.04 installation on each kiosk PC

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Nvidia drivers for RTX 4000 Ada
sudo ubuntu-drivers autoinstall
# OR manually: sudo apt install nvidia-driver-545

# 4. Install required packages
sudo apt install -y \
  chromium-browser \
  nodejs \
  npm \
  xinit \
  openbox \
  unclutter \
  git

# 5. Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 6. Verify installations
chromium-browser --version
node --version
pnpm --version

# 7. Configure display resolution (2160x5120 portrait)
# Edit /etc/X11/xorg.conf or use xrandr
xrandr --output DP-1 --mode 2160x5120 --rotate left

# 8. Create kiosk user
sudo useradd -m -s /bin/bash kiosk
sudo passwd kiosk

# 9. Configure auto-login (optional but recommended)
sudo systemctl edit getty@tty1
# Add:
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin kiosk --noclear %I $TERM

# 10. Deploy application
sudo mkdir -p /opt/iron-mountain-web
sudo chown kiosk:kiosk /opt/iron-mountain-web
# ... copy files, install deps, etc.
```

**Audio Configuration:**

For your Mono Pendant Speaker setup:

```bash
# Test audio output
speaker-test -c 1 -t wav

# If needed, configure default audio device
# List devices:
aplay -l

# Set default in ~/.asoundrc:
cat > ~/.asoundrc << 'EOF'
pcm.!default {
    type hw
    card 0
    device 0
}
ctl.!default {
    type hw
    card 0
}
EOF
```

**Hide cursor (optional):**
```bash
# Install unclutter
sudo apt install unclutter

# Add to Chrome launch flags
--disable-cursor
```

### Monitoring & Maintenance

**Health check endpoint:**
Add to your Next.js app (`/api/health`):
```typescript
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

**Watchdog script:**
```bash
#!/bin/bash
# Check if app is running and restart if needed
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "App not responding, restarting..."
    sudo systemctl restart kiosk-2.service
fi
```

Add to crontab: `*/5 * * * * /opt/iron-mountain-web/scripts/watchdog.sh`

### Remote Management

For production kiosks, consider:
- **TeamViewer** or **AnyDesk** for remote access
- **Portainer** if using Docker
- **PM2 Plus** for monitoring if using PM2
- **Grafana + Prometheus** for metrics

### Security Considerations

1. **Disable SSH password authentication** (use keys only)
2. **Enable automatic security updates**
3. **Firewall**: Only allow MQTT, HTTP(S), and remote access ports
4. **Use read-only filesystem** for root (optional, advanced)

```bash
# Example: UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH (from specific IPs only)
sudo ufw allow 1883/tcp  # MQTT
sudo ufw allow 8883/tcp  # MQTT over TLS
sudo ufw enable
```
