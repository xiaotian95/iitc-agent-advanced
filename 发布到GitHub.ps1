# 一键发布到 GitHub Pages
# 适用：本机访问 github.com 受限、但 api.github.com 可用的情况。
# 用法：右键“使用 PowerShell 运行”，或在 PowerShell 中执行 .\发布到GitHub.ps1
# 说明：会读取本机已保存的 GitHub 凭据（Windows 凭据管理器），不会把令牌写进任何文件。

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$owner = "xiaotian95"
$repo = "iitc-agent-advanced"
$branch = "main"
$base = "https://api.github.com/repos/$owner/$repo"

$env:GCM_INTERACTIVE = "never"
$cred = ("protocol=https`nhost=github.com`n`n" | git credential fill) 2>$null
$token = (($cred -split "`n" | Where-Object { $_ -like 'password=*' }) -replace '^password=', '')
if (-not $token) {
  Write-Host "没有拿到 GitHub 凭据，请先在本机登录一次 GitHub（git push 或 GitHub Desktop）。" -ForegroundColor Red
  Read-Host "按回车退出"
  exit 1
}
$headers = @{
  Authorization          = "Bearer $token"
  "User-Agent"           = "iitc-deploy"
  "Accept"               = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

$exclude = '\\(\.git|tools|preview|dist|\.netlify)\\'
$files = Get-ChildItem -Path $root -Recurse -File | Where-Object { $_.FullName -notmatch $exclude }
Write-Host "准备发布 $($files.Count) 个文件到 $owner/$repo ..." -ForegroundColor Cyan

$ok = 0
$fail = 0
foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  $enc = (($rel -split '/') | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/'
  $sha = $null
  try {
    $exists = Invoke-RestMethod -Uri "$base/contents/$enc" -Headers $headers -TimeoutSec 30
    if ($exists -and $exists.sha) { $sha = $exists.sha }
  } catch {
    # 404 = 新文件，无需 sha
  }
  $body = @{
    message = "update $rel"
    content = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($f.FullName))
    branch  = $branch
  }
  if ($sha) { $body["sha"] = $sha }
  $json = $body | ConvertTo-Json -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  try {
    Invoke-RestMethod -Uri "$base/contents/$enc" -Method Put -Headers $headers -Body $bytes -ContentType "application/json; charset=utf-8" -TimeoutSec 60 | Out-Null
    Write-Host "  OK  $rel" -ForegroundColor Green
    $ok++
  } catch {
    Write-Host "  FAIL $rel :: $($_.ErrorDetails.Message)" -ForegroundColor Red
    $fail++
  }
}

Write-Host ""
Write-Host "完成：成功 $ok，失败 $fail" -ForegroundColor Cyan
Write-Host "线上地址：https://$owner.github.io/$repo/"
Write-Host "GitHub Pages 通常 1 分钟内自动重新构建。"
if ($fail -gt 0) { Read-Host "有失败项，按回车退出" }
