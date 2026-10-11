#requires -Version 5.1
[CmdletBinding()]
param(
    [string]$ProjectPath = 'C:\Users\danie\bazaara\AfriLife\GameClient\AfriLife-Unity',
    [string]$UnityEditorPath,
    [switch]$Preview,
    [switch]$SyncOnly
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$ProjectPath = [IO.Path]::GetFullPath($ProjectPath)
foreach ($required in @('Assets','Packages\manifest.json','ProjectSettings\ProjectVersion.txt')) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectPath $required))) {
        throw ('Create a Unity 6 Universal 3D / URP project at ' + $ProjectPath + ' using Unity Hub, or pass -ProjectPath.')
    }
}
if (Get-Process -Name Unity -ErrorAction SilentlyContinue) {
    throw 'Save and close Unity before updating AfriLife.'
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Install Git for Windows before running this tool.'
}
$stage = Join-Path $env:TEMP ('afrilife-source-' + [guid]::NewGuid().ToString('N'))
$targetRoot = Join-Path $ProjectPath 'Assets\_AfriLife'
$statePath = Join-Path $ProjectPath 'ProjectSettings\AfriLifeSourceHashes.json'
try {
    Write-Host 'Getting latest AfriLife GitHub source...'
    & git clone --quiet --depth 1 --single-branch --branch main 'https://github.com/danielkalio400-bot/AfriLife.git' $stage
    if ($LASTEXITCODE -ne 0) { throw 'AfriLife GitHub clone failed.' }
    $sourceRoot = Join-Path $stage 'GameClient\StarterAssets\Assets\_AfriLife'
    if (-not (Test-Path -LiteralPath $sourceRoot)) {
        throw 'GitHub clone does not contain AfriLife Unity starter source.'
    }

    $known = @{}
    if (Test-Path -LiteralPath $statePath) {
        $previous = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
        if ($previous.version -ne 1) { throw 'Unknown source hash manifest.' }
        foreach ($item in $previous.hashes.PSObject.Properties) {
            $known[$item.Name] = [string]$item.Value
        }
    }
    $files = @(Get-ChildItem -LiteralPath $sourceRoot -Filter '*.cs' -File -Recurse)
    if ($files.Count -lt 100) { throw 'Source file inventory unexpectedly incomplete.' }
    $entries = @()
    $conflicts = @()
    foreach ($file in $files) {
        $relative = $file.FullName.Substring($sourceRoot.Length).TrimStart([char[]]@('\','/'))
        if ($relative -match '(^|[\\/])\.\.([\\/]|$)') { throw 'Invalid source path.' }
        $target = Join-Path $targetRoot $relative
        $digest = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
        $current = if (Test-Path -LiteralPath $target) {
            (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
        } else { $null }
        if ($null -ne $current -and $current -ne $digest -and
            (-not $known.ContainsKey($relative) -or $known[$relative] -ne $current)) {
            $conflicts += $relative
        }
        $entries += [pscustomobject]@{
            Relative = $relative
            Source = $file.FullName
            Target = $target
            NewHash = $digest
            CurrentHash = $current
        }
    }
    if ($conflicts.Count -gt 0) {
        throw ('Refusing to overwrite locally modified scripts: ' + ($conflicts -join ', '))
    }
    $changes = @($entries | Where-Object { $_.NewHash -ne $_.CurrentHash })
    Write-Host ('AfriLife C# scripts: ' + $entries.Count + '; changes: ' + $changes.Count)
    if ($Preview) {
        Write-Host 'PREVIEW: no project files written.'
        return
    }

    foreach ($entry in $changes) {
        New-Item -ItemType Directory -Path (Split-Path -Parent $entry.Target) -Force | Out-Null
        Copy-Item -LiteralPath $entry.Source -Destination $entry.Target
        if ((Get-FileHash -LiteralPath $entry.Target -Algorithm SHA256).Hash -ne $entry.NewHash) {
            throw ('AfriLife source verification failed: ' + $entry.Relative)
        }
    }
    $hashes = @{}
    foreach ($entry in $entries) { $hashes[$entry.Relative] = $entry.NewHash }
    @{ version = 1; hashes = $hashes } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statePath -Encoding UTF8
    Write-Host ('Verified ' + $entries.Count + ' C# files; updated ' + $changes.Count + '. Original art and local scenes preserved.')
    if ($SyncOnly) { return }

    if (-not $UnityEditorPath) {
        $version = Get-Content -LiteralPath (Join-Path $ProjectPath 'ProjectSettings\ProjectVersion.txt') -Raw
        if ($version -notmatch '(?m)^m_EditorVersion:\s*(\S+)') { throw 'Unity Editor version unknown.' }
        $UnityEditorPath = Join-Path $env:ProgramFiles ('Unity\Hub\Editor\' + $Matches[1] + '\Editor\Unity.exe')
    }
    if (-not (Test-Path -LiteralPath $UnityEditorPath)) { throw 'Unity Editor executable not installed.' }

    Write-Host 'Generating two playable Unity scenes: Lagos and Accra...'
    $log = Join-Path $env:TEMP 'AfriLife-Production-Cities.log'
    if (Test-Path -LiteralPath $log) { Remove-Item -LiteralPath $log }
    $argsForUnity = @('-batchmode', '-quit', '-projectPath', ('"' + $ProjectPath + '"'),
        '-executeMethod','AfriLife.Editor.AfriLifeProductionCityBuilder.Batch',
        '-logFile', ('"' + $log + '"'))
    $process = Start-Process -FilePath $UnityEditorPath -ArgumentList $argsForUnity -Wait -PassThru
    $lagos = Join-Path $ProjectPath 'Assets\_AfriLife\Scenes\ProductionLagos.unity'
    $accra = Join-Path $ProjectPath 'Assets\_AfriLife\Scenes\ProductionAccra.unity'
    $confirmed = (Test-Path -LiteralPath $log) -and [bool](
        Select-String -LiteralPath $log -SimpleMatch 'AFRILIFE_CITY_BUILD_RESULT=SUCCESS')
    if ($process.ExitCode -ne 0 -or -not $confirmed -or
        -not (Test-Path -LiteralPath $lagos) -or -not (Test-Path -LiteralPath $accra)) {
        if (Test-Path -LiteralPath $log) { Get-Content -LiteralPath $log -Tail 85 }
        throw ('AfriLife Unity city authoring failed; Editor exit ' + $process.ExitCode)
    }
    Write-Host 'AFRILIFE CITY SCENES CREATED IN UNITY'
    Write-Host ('Lagos: ' + $lagos)
    Write-Host ('Accra: ' + $accra)
}
finally {
    if (Test-Path -LiteralPath $stage) {
        Remove-Item -LiteralPath $stage -Recurse -Force
    }
}
