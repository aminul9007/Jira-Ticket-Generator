# Configures Windows Firewall so other devices on your LAN can reach the dev server.
# Voice on phones/tablets requires HTTPS (npm run dev:share).
#
# Usage:
#   npm run lan:firewall
#   (or run automatically by npm run dev:share)

param(
  [switch]$Elevated
)

$ErrorActionPreference = 'Stop'

function Test-IsAdmin {
  return ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
  )
}

$scriptPath = $MyInvocation.MyCommand.Path

if (-not $Elevated -and -not (Test-IsAdmin)) {
  Write-Host ''
  Write-Host '========================================' -ForegroundColor Cyan
  Write-Host '  LAN Firewall Setup (Admin required)' -ForegroundColor Cyan
  Write-Host '========================================' -ForegroundColor Cyan
  Write-Host ''
  Write-Host 'Windows will ask for Administrator permission.' -ForegroundColor Yellow
  Write-Host 'Click YES - this only opens ports 5173 and 3001 for your Wi-Fi.' -ForegroundColor Yellow
  Write-Host ''
  Write-Host 'Without this, other PCs CANNOT connect to your dev server.' -ForegroundColor Red
  Write-Host ''

  try {
    $proc = Start-Process powershell -Verb RunAs -Wait -PassThru -ArgumentList @(
      '-ExecutionPolicy', 'Bypass',
      '-File', "`"$scriptPath`"",
      '-Elevated'
    )
    if ($proc.ExitCode -eq 1223) {
      Write-Host 'Firewall setup cancelled (you clicked No on the Admin prompt).' -ForegroundColor Red
      Write-Host 'Right-click scripts\allow-lan-firewall.bat -> Run as administrator' -ForegroundColor Yellow
      exit 1
    }
    exit $proc.ExitCode
  } catch {
    Write-Host 'Firewall setup cancelled. Other devices will remain blocked.' -ForegroundColor Red
    Write-Host 'Right-click scripts\allow-lan-firewall.bat -> Run as administrator' -ForegroundColor Yellow
    exit 1
  }
}

Write-Host ''
Write-Host 'Configuring Windows Firewall for LAN + voice access...' -ForegroundColor Cyan
Write-Host ''

# 1. Disable Node.js inbound BLOCK rules (root cause - blocks other PCs).
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
  Write-Host '  No Node.js inbound BLOCK rules (already OK).' -ForegroundColor DarkGray
}

# 2. Allow dev ports on all network profiles.
$portRules = @(
  @{ Name = 'Jira Ticket Generator Dev 5173'; Port = 5173; Description = 'Vite HTTPS dev server (LAN + voice)' },
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

  Write-Host "  Allowed inbound TCP port $($entry.Port)." -ForegroundColor Green
}

# 3. Allow node.exe (application rules can override port rules).
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

  Write-Host '  Allowed inbound for node.exe.' -ForegroundColor Green
}

Write-Host ''
Write-Host 'Firewall configured successfully.' -ForegroundColor Green
Write-Host ''
exit 0
