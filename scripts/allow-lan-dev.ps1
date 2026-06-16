# Opens Windows Firewall for LAN dev access.
# MUST run as Administrator (script auto-requests elevation when possible).
#
# Root cause fix: Windows often creates "Node.js JavaScript Runtime" BLOCK rules
# that prevent other PCs from connecting, even when port 5173 allow rules exist.

$ErrorActionPreference = 'Stop'

function Test-IsAdmin {
  return ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
  )
}

if (-not (Test-IsAdmin)) {
  Write-Host ''
  Write-Host 'Windows needs Administrator permission to change firewall rules.' -ForegroundColor Yellow
  Write-Host 'This is NOT installing anything - it only allows other PCs on your Wi-Fi' -ForegroundColor DarkGray
  Write-Host 'to reach port 5173 (your dev server).' -ForegroundColor DarkGray
  Write-Host ''
  Write-Host 'Click YES on the Windows UAC prompt when it appears...' -ForegroundColor Yellow
  Write-Host ''

  $scriptPath = $MyInvocation.MyCommand.Path
  try {
    Start-Process powershell -Verb RunAs -ArgumentList @(
      '-ExecutionPolicy', 'Bypass',
      '-File', "`"$scriptPath`""
    ) -ErrorAction Stop | Out-Null
    Write-Host 'Admin window opened. After it finishes, other PCs should be able to connect.' -ForegroundColor Green
    exit 0
  } catch {
    Write-Host 'Firewall setup was skipped (Admin permission was not granted).' -ForegroundColor Red
    Write-Host ''
    Write-Host 'Other PCs may NOT be able to connect until you run ONE of these:' -ForegroundColor Yellow
    Write-Host '  npm run lan:firewall          (click Yes on UAC)' -ForegroundColor White
    Write-Host '  scripts\allow-lan-firewall.bat  (right-click -> Run as administrator)' -ForegroundColor White
    Write-Host ''
    exit 1
  }
}

Write-Host ''
Write-Host 'Configuring Windows Firewall for LAN dev access...' -ForegroundColor Cyan
Write-Host ''

# 1. Disable Node.js inbound BLOCK rules (these block other PCs from connecting).
$nodeBlockRules = Get-NetFirewallRule -DisplayName 'Node.js JavaScript Runtime' -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' }

$disabledCount = 0
foreach ($rule in $nodeBlockRules) {
  Disable-NetFirewallRule -Name $rule.Name | Out-Null
  $disabledCount += 1
}

if ($disabledCount -gt 0) {
  Write-Host "  Disabled $disabledCount Node.js inbound BLOCK rule(s)." -ForegroundColor Green
} else {
  Write-Host '  No Node.js inbound BLOCK rules found (already OK).' -ForegroundColor DarkGray
}

# 2. Allow dev ports for all profiles.
$portRules = @(
  @{ Name = 'Jira Ticket Generator Dev 5173'; Port = 5173; Description = 'Vite frontend dev server' },
  @{ Name = 'Jira Ticket Generator Dev 3001'; Port = 3001; Description = 'Jira API backend' }
)

foreach ($entry in $portRules) {
  $existing = Get-NetFirewallRule -DisplayName $entry.Name -ErrorAction SilentlyContinue
  if ($existing) {
    Remove-NetFirewallRule -DisplayName $entry.Name
  }

  New-NetFirewallRule `
    -DisplayName $entry.Name `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort $entry.Port `
    -Profile Any `
    -Description $entry.Description | Out-Null

  Write-Host "  Added allow rule for port $($entry.Port)." -ForegroundColor Green
}

# 3. Allow node.exe explicitly (covers cases where app rules override port rules).
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodePath -and (Test-Path $nodePath)) {
  $nodeRuleName = 'Jira Ticket Generator Node.js LAN'
  $existingNode = Get-NetFirewallRule -DisplayName $nodeRuleName -ErrorAction SilentlyContinue
  if ($existingNode) {
    Remove-NetFirewallRule -DisplayName $nodeRuleName
  }

  New-NetFirewallRule `
    -DisplayName $nodeRuleName `
    -Direction Inbound `
    -Action Allow `
    -Program $nodePath `
    -Profile Any `
    -Description 'Allow LAN inbound to Node.js dev servers' | Out-Null

  Write-Host "  Added allow rule for node.exe." -ForegroundColor Green
}

Write-Host ''
Write-Host 'Firewall is configured for LAN access.' -ForegroundColor Green
Write-Host 'Restart the dev servers: npm run dev:restart' -ForegroundColor Yellow
Write-Host ''
