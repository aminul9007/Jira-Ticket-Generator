# Start llama.cpp server with your local Qwen model (OpenAI-compatible API).
# Download llama.cpp: https://llama-cpp.com/download/
# Requires `llama-server` on PATH (from the Windows zip).

$ErrorActionPreference = 'Stop'

$ModelPath = if ($env:LLAMACPP_MODEL_PATH) {
  $env:LLAMACPP_MODEL_PATH
} else {
  'D:\Software\qwen2.5-3b-instruct-q4_k_m.gguf'
}

$Port = if ($env:LLAMACPP_PORT) { $env:LLAMACPP_PORT } else { '8080' }
$BindHost = if ($env:LLAMACPP_HOST) { $env:LLAMACPP_HOST } else { '127.0.0.1' }

if (-not (Test-Path -LiteralPath $ModelPath)) {
  Write-Host "Model not found: $ModelPath" -ForegroundColor Red
  Write-Host 'Set LLAMACPP_MODEL_PATH to your .gguf file path.'
  exit 1
}

$server = Get-Command llama-server -ErrorAction SilentlyContinue
if (-not $server) {
  Write-Host 'llama-server not found on PATH.' -ForegroundColor Red
  Write-Host 'Install from https://llama-cpp.com/download/ and add the bin folder to PATH.'
  exit 1
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  llama.cpp server (Qwen 2.5)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host "  Model:  $ModelPath"
Write-Host "  API:    http://${BindHost}:${Port}/v1"
Write-Host ''
Write-Host 'In .env.local set:' -ForegroundColor Yellow
Write-Host '  VITE_AI_PROVIDER=llama-cpp'
Write-Host "  VITE_LLAMACPP_BASE_URL=http://${BindHost}:${Port}/v1"
Write-Host ''
Write-Host 'Then run: npm run dev' -ForegroundColor Cyan
Write-Host ''

& llama-server `
  -m $ModelPath `
  --host $BindHost `
  --port $Port `
  -c 4096 `
  --parallel 1
