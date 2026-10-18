<#
  Personal Intelligence Loop - 실행본 확인 및 preview 재시작
  사용법 (프로젝트 루트에서):
    powershell -ExecutionPolicy Bypass -File scripts\restart-preview.ps1          # 확인만
    powershell -ExecutionPolicy Bypass -File scripts\restart-preview.ps1 -Restart # 이 프로젝트 서버만 종료 후 빌드·재시작
  다른 프로그램은 종료하지 않습니다. 명령줄에 이 프로젝트 경로가 들어 있는 node 프로세스만 대상입니다.
#>
param([switch]$Restart, [int[]]$Ports = @(3000, 3001, 3100))
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$buildId = Join-Path $root 'apps\web\.next\BUILD_ID'
$buildTime = if (Test-Path $buildId) { (Get-Item $buildId).LastWriteTime } else { $null }
Write-Host "프로젝트 루트 : $root"
Write-Host ("현재 빌드 시각: " + $(if ($buildTime) { $buildTime } else { '빌드 없음 (.next 없음)' }))
Write-Host ''

$ours = @()
foreach ($port in $Ports) {
  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $conns) { Write-Host "[$port] 비어 있음"; continue }
  foreach ($procId in ($conns.OwningProcess | Sort-Object -Unique)) {
    $p = Get-CimInstance Win32_Process -Filter "ProcessId=$procId"
    $cmd = [string]$p.CommandLine
    $mine = $cmd -and $cmd.ToLower().Contains($root.ToLower())
    $stale = $buildTime -and $p.CreationDate -lt $buildTime
    Write-Host "[$port] PID $procId $($p.Name) 시작 $($p.CreationDate)"
    Write-Host "       $cmd"
    if ($mine) {
      if ($stale) { Write-Host '       => 이 프로젝트 서버지만 현재 빌드보다 먼저 시작됨: 디자인(CSS)이 깨져 보이는 원인' -ForegroundColor Red }
      else { Write-Host '       => 이 프로젝트 서버 (현재 빌드 이후 시작)' -ForegroundColor Green }
      $ours += $procId
    } else { Write-Host '       => 다른 폴더 또는 다른 프로그램. 건드리지 않습니다.' -ForegroundColor Yellow }
  }
}

function Test-Page([int]$port) {
  try {
    $html = (Invoke-WebRequest "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 5).Content
    $newCopy = $html.Contains('나에게 필요한 이야기')
    $css = [regex]::Match($html, 'href="(/_next/static/[^"]+\.css)"').Groups[1].Value
    $cssOk = $false
    if ($css) { $r = Invoke-WebRequest "http://127.0.0.1:$port$css" -UseBasicParsing -TimeoutSec 5; $cssOk = $r.StatusCode -eq 200 -and $r.Headers['Content-Type'] -like 'text/css*' }
    Write-Host "[$port] 새 홈 문구: $newCopy / CSS $css 정상: $cssOk"
  } catch { Write-Host "[$port] 응답 확인 실패: $($_.Exception.Message)" }
}
Write-Host ''
foreach ($port in $Ports) { if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { Test-Page $port } }

if (-not $Restart) { Write-Host "`n재시작하려면 -Restart 를 붙여 다시 실행하세요."; exit 0 }

foreach ($procId in ($ours | Sort-Object -Unique)) {
  # npm/cmd 부모 창까지 함께 정리하되, 이 프로젝트 경로가 명령줄에 있는 것만
  Write-Host "이 프로젝트 서버 PID $procId 종료"
  Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.ToLower().Contains($root.ToLower()) -and $_.CommandLine -match 'next' } | ForEach-Object {
  Write-Host "남은 이 프로젝트 next 프로세스 PID $($_.ProcessId) 종료"; Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

Set-Location $root
if (-not (Test-Path (Join-Path $root 'node_modules'))) { & npm.cmd ci; if ($LASTEXITCODE) { exit $LASTEXITCODE } }
& npm.cmd run build
if ($LASTEXITCODE) { Write-Host '빌드 실패. 위 오류를 확인하세요.' -ForegroundColor Red; exit $LASTEXITCODE }
Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', 'npm.cmd run preview' -WorkingDirectory $root
Write-Host 'preview 창을 열었습니다. 준비될 때까지 기다리는 중...'
for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; if (Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue) { break } }
Test-Page 3100
Write-Host "`n브라우저에서 http://127.0.0.1:3100 을 열고 Ctrl+F5 로 새로 고침하세요."
