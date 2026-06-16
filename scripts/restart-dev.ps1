# Stop all dev servers, configure firewall, then start frontend + Jira API.
#
#   npm run dev:share         HTTPS LAN + voice on other devices (recommended)
#   npm run dev:restart:lan   same as dev:share
#   npm run dev:restart       HTTP only (no voice on phones)

param(
  [switch]$Lan,
  [switch]$SkipFirewall
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$shareMode = $Lan

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
if ($shareMode) {
  Write-Host '  Share on LAN (HTTPS + voice)' -ForegroundColor Cyan
} else {
  Write-Host '  Restart Jira Ticket Generator' -ForegroundColor Cyan
}
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host 'Step 1/3: Stopping old servers...' -ForegroundColor Yellow
& (Join-Path $PSScriptRoot 'stop-dev-ports.ps1')
Start-Sleep -Seconds 1

$firewallOk = $false
if (-not $SkipFirewall) {
  Write-Host ''
  Write-Host 'Step 2/3: Opening Windows Firewall for LAN devices...' -ForegroundColor Yellow
  & (Join-Path $PSScriptRoot 'allow-lan-dev.ps1')
  $firewallOk = ($LASTEXITCODE -eq 0)
  if (-not $firewallOk) {
    Write-Host ''
    Write-Host '========================================' -ForegroundColor Red
    Write-Host '  FIREWALL NOT CONFIGURED' -ForegroundColor Red
    Write-Host '========================================' -ForegroundColor Red
    Write-Host 'Other devices will be BLOCKED until you do this ONCE:' -ForegroundColor Yellow
    Write-Host ''
    Write-Host '  1. Open File Explorer -> scripts folder' -ForegroundColor White
    Write-Host '  2. Right-click allow-lan-firewall.bat' -ForegroundColor White
    Write-Host '  3. Click "Run as administrator"' -ForegroundColor White
    Write-Host '  4. Click YES on the Windows prompt' -ForegroundColor White
    Write-Host ''
  }
  Start-Sleep -Seconds 1
} else {
  Write-Host ''
  Write-Host 'Step 2/3: Skipping firewall (-SkipFirewall)' -ForegroundColor DarkGray
  $firewallOk = $true
}

$frontendScript = if ($shareMode) { 'dev:lan' } else { 'dev' }
$protocol = if ($shareMode) { 'https' } else { 'http' }

. (Join-Path $PSScriptRoot 'get-lan-ip.ps1')
$lanIp = Get-LanIPv4
if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host ''
Write-Host 'Step 3/3: Starting servers in new windows...' -ForegroundColor Yellow

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy', 'Bypass',
    '-Command', 'npm run api:dev'
  )

Start-Sleep -Seconds 2

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy', 'Bypass',
    '-Command', "npm run $frontendScript"
  )

Write-Host '  Waiting for servers to start...' -ForegroundColor DarkGray
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Seconds 1
  $listening = netstat -ano | Select-String ':5173\s+.*LISTENING'
  if ($listening) {
    $ready = $true
    break
  }
}

Write-Host ''
if ($ready) {
  Write-Host 'Done - servers are running.' -ForegroundColor Green
} else {
  Write-Host 'Servers were started in new windows but port 5173 is not ready yet.' -ForegroundColor Yellow
  Write-Host 'Check the new PowerShell windows for errors.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host "  This PC:       ${protocol}://localhost:5173/" -ForegroundColor White
Write-Host "  Other devices: ${protocol}://${lanIp}:5173/" -ForegroundColor Yellow
Write-Host ''
if ($shareMode) {
  Write-Host '  Voice on other devices:' -ForegroundColor Cyan
  Write-Host '    1. Open the HTTPS link above on their phone/PC' -ForegroundColor White
  Write-Host '    2. Accept the certificate warning (Advanced -> Proceed)' -ForegroundColor White
  Write-Host '    3. Allow microphone when prompted' -ForegroundColor White
  Write-Host ''
  Write-Host '  If other PC shows squid-proxy / Connection timed out:' -ForegroundColor Yellow
  Write-Host '    That PC uses a corporate proxy. On THAT machine add bypass for:' -ForegroundColor White
  Write-Host "    $lanIp  and  192.168.*  (Settings -> Network -> Proxy)" -ForegroundColor White
  Write-Host '    Or use a phone on the same Wi-Fi instead.' -ForegroundColor White
  Write-Host ''
  if (-not $firewallOk) {
    Write-Host '  !! Run allow-lan-firewall.bat as Admin before sharing !!' -ForegroundColor Red
    Write-Host ''
  }
}
Write-Host '  Troubleshoot: npm run lan:diagnose' -ForegroundColor DarkGray
Write-Host ''

if (-not $firewallOk) { exit 1 }
exit 0
