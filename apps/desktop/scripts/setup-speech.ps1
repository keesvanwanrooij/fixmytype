$ErrorActionPreference = 'Stop'
# npm can inherit PowerShell 7's module path while launching Windows PowerShell 5.1.
# Prefer the child shell's own built-in modules without changing the machine environment.
$env:PSModulePath = (Join-Path $PSHOME 'Modules') + [IO.Path]::PathSeparator + $env:PSModulePath
Import-Module Microsoft.PowerShell.Utility -ErrorAction Stop
Import-Module Microsoft.PowerShell.Archive -ErrorAction Stop
$runtimeDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../.cache/runtime'))
New-Item -ItemType Directory -Force -Path $runtimeDirectory | Out-Null
function Get-VerifiedArtifact([string]$Url, [string]$Destination, [string]$Sha256) {
    if ((Test-Path -LiteralPath $Destination) -and (Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash -eq $Sha256) { return }
    Write-Host "Downloading $(Split-Path $Destination -Leaf)..."
    & curl.exe -L --fail --retry 2 --silent --show-error --output $Destination $Url
    if ($LASTEXITCODE -ne 0) { throw 'The download failed. Run setup again to retry.' }
    if ((Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash -ne $Sha256) { throw 'SHA-256 mismatch. The downloaded file will not be used.' }
}
Get-VerifiedArtifact 'https://github.com/ggml-org/whisper.cpp/releases/download/b4938/whisper-bin-x64.zip' (Join-Path $runtimeDirectory 'whisper.zip') 'c2a4b60edb11f7e11a9191ffb50929535527d4d91c9903dbe3e554583bbbc63d'
Expand-Archive -LiteralPath (Join-Path $runtimeDirectory 'whisper.zip') -DestinationPath (Join-Path $runtimeDirectory 'whisper') -Force
Get-VerifiedArtifact 'https://huggingface.co/ggerganov/whisper.cpp/resolve/5359861c739e955e79d9a303bcbc70fb988958b1/ggml-base.bin' (Join-Path $runtimeDirectory 'ggml-base.bin') '60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe'
Write-Host 'Local speech is ready. Start the app, choose Local setup, then Check again.'
