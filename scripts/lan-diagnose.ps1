# LAN connectivity checklist for sharing the dev server on Wi-Fi.

$ErrorActionPreference = 'SilentlyContinue'

function Get-LanIPv4 {
  $address = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.InterfaceAlias -notmatch 'Loopback|OpenVPN|VPN|Surfshark|TAP|TUN' -and
      $_.IPAddress -notlike '169.254.*' -and
      $_.IPAddress -notlike '10.12.*'
    } |
    Select-Object -First 1

  return $address.IPAddress
}

$lanIp = Get-LanIPv4
if (-not $lanIp) { $lanIp = 'UNKNOWN' }

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  LAN Dev Server Diagnostics' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host "  Your LAN IP:     $lanIp" -ForegroundColor Yellow
Write-Host "  HTTP share URL:  http://${lanIp}:5173/" -ForegroundColor White
Write-Host "  HTTPS share URL: https://${lanIp}:5173/  (npm run dev:share - required for voice)" -ForegroundColor White
Write-Host ''

$listening = netstat -ano | Select-String ':5173\s+.*LISTENING'
if ($listening) {
  Write-Host '  [OK] Port 5173 is listening' -ForegroundColor Green
  $listening | ForEach-Object { Write-Host "       $_" -ForegroundColor DarkGray }
} else {
  Write-Host '  [!!] Port 5173 is NOT listening - run: npm run dev:share' -ForegroundColor Red
}

Write-Host ''
$nodeBlocks = Get-NetFirewallRule -DisplayName 'Node.js JavaScript Runtime' -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' }

if ($nodeBlocks) {
  Write-Host "  [!!] Node.js inbound BLOCK rules active ($(@($nodeBlocks).Count))" -ForegroundColor Red
  Write-Host '       This is the most common reason other PCs cannot connect.' -ForegroundColor Red
  Write-Host '       Fix (Admin): npm run lan:firewall' -ForegroundColor Yellow
} else {
  Write-Host '  [OK] No Node.js inbound BLOCK rules' -ForegroundColor Green
}

$portRule = Get-NetFirewallRule -DisplayName 'Jira Ticket Generator Dev 5173' -ErrorAction SilentlyContinue |
  Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' }

if ($portRule) {
  Write-Host '  [OK] Firewall allow rule for port 5173' -ForegroundColor Green
} else {
  Write-Host '  [!!] Missing project firewall allow rule for port 5173' -ForegroundColor Red
  Write-Host '       Fix (Admin): npm run lan:firewall' -ForegroundColor Yellow
}

Write-Host ''
$profile = Get-NetConnectionProfile | Select-Object -First 1
if ($profile) {
  $color = if ($profile.NetworkCategory -eq 'Public') { 'Yellow' } else { 'Green' }
  Write-Host "  Network profile: $($profile.NetworkCategory) ($($profile.InterfaceAlias))" -ForegroundColor $color
  if ($profile.InterfaceAlias -match 'Ethernet' -or $profile.InterfaceAlias -match 'Ethernet') {
    Write-Host '  Tip: You are on Ethernet. Other PCs on Wi-Fi need router' -ForegroundColor DarkGray
    Write-Host '       "AP/client isolation" disabled to reach this PC.' -ForegroundColor DarkGray
  }
}

Write-Host ''
Write-Host '  From the OTHER PC:' -ForegroundColor Cyan
Write-Host '    1. Same network (not guest Wi-Fi)' -ForegroundColor White
Write-Host "    2. ping $lanIp" -ForegroundColor White
Write-Host "    3. Open https://${lanIp}:5173/  (HTTPS required - NOT http)" -ForegroundColor White
Write-Host ''
Write-Host '  If you see "squid-proxy" or "Connection timed out":' -ForegroundColor Yellow
Write-Host '    The other PC has a corporate proxy blocking LAN access.' -ForegroundColor Yellow
Write-Host '    Fix on THAT PC: Settings -> Network -> Proxy ->' -ForegroundColor White
Write-Host '    "Bypass proxy for:" add  192.168.0.73  and  192.168.*' -ForegroundColor White
Write-Host '    Or test from a phone on Wi-Fi (no proxy):' -ForegroundColor White
Write-Host "    https://${lanIp}:5173/" -ForegroundColor Yellow
Write-Host ''

if ($lanIp -ne 'UNKNOWN') {
  $curlHttp = curl.exe -I --connect-timeout 3 "http://${lanIp}:5173/" 2>&1 | Select-String 'HTTP/'
  $curlHttps = curl.exe -k -I --connect-timeout 3 "https://${lanIp}:5173/" 2>&1 | Select-String 'HTTP/'
  if ($curlHttp) {
    Write-Host "  [OK] HTTP responds on this PC: $curlHttp" -ForegroundColor Green
  } elseif ($curlHttps) {
    Write-Host "  [OK] HTTPS responds on this PC: $curlHttps" -ForegroundColor Green
    Write-Host '       (dev:share uses HTTPS - this is expected)' -ForegroundColor DarkGray
  } else {
    Write-Host '  [!!] Server not responding on LAN IP yet' -ForegroundColor Red
    Write-Host '       Run: npm run dev:share' -ForegroundColor Yellow
  }

  if ($nodeBlocks -or -not $portRule) {
    Write-Host ''
    Write-Host '  NOTE: Even if HTTPS works on THIS PC, other devices are blocked' -ForegroundColor Yellow
    Write-Host '        until you run allow-lan-firewall.bat as Administrator.' -ForegroundColor Yellow
  }
}

Write-Host ''
