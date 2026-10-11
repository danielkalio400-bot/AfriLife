#requires -Version 5.1
[CmdletBinding()]
param(
  [string]$ProjectPath = 'C:\Users\danie\bazaara\AfriLife\GameClient\AfriLife-Unity',
  [string]$UnityEditorPath
)
$ErrorActionPreference='Stop'
$ProjectPath=[IO.Path]::GetFullPath($ProjectPath)
$version=Join-Path $ProjectPath 'ProjectSettings\ProjectVersion.txt'
if(Test-Path -LiteralPath $version){
  Write-Host 'AfriLife Unity project already initialized.'
  return
}
if(Get-Process -Name Unity -ErrorAction SilentlyContinue){
  throw 'Close the Unity Editor before initializing AfriLife.'
}
if(-not $UnityEditorPath){
  $editors=Join-Path $env:ProgramFiles 'Unity\Hub\Editor'
  $installed=@(Get-ChildItem -LiteralPath $editors -Directory |
    Where-Object { $_.Name -match '^6000\.' -and
      (Test-Path (Join-Path $_.FullName 'Editor\Unity.exe')) } |
    Sort-Object Name -Descending)
  if($installed.Count -eq 0){ throw 'Install Unity 6 or provide -UnityEditorPath.' }
  $UnityEditorPath=Join-Path $installed[0].FullName 'Editor\Unity.exe'
}
if(-not(Test-Path -LiteralPath $UnityEditorPath)){throw 'Unity executable not found.'}
$locations=@(
  (Join-Path (Split-Path -Parent $UnityEditorPath) 'Data\Resources\PackageManager\ProjectTemplates'),
  (Join-Path $env:APPDATA 'UnityHub\Templates')
)
$templates=@()
foreach($dir in $locations){
  if(Test-Path -LiteralPath $dir){
    $templates+=@(Get-ChildItem -LiteralPath $dir -Filter '*.tgz' -File |
      Where-Object { $_.Name -match 'com\.unity\.template\.(urp-blank|universal|3d-urp)[-@]' })
  }
}
if($templates.Count -eq 0){
  throw 'Unity Universal 3D template not installed. Download Universal 3D in Unity Hub and rerun.'
}
$template=@($templates | Sort-Object LastWriteTime -Descending)[0]
if(Test-Path -LiteralPath $ProjectPath){
  $contents=@(Get-ChildItem -LiteralPath $ProjectPath -Force)
  if($contents.Count -gt 0){throw 'Existing folder contains non-project files; choose a new AfriLife project path.'}
}
New-Item -ItemType Directory -Path (Split-Path -Parent $ProjectPath) -Force | Out-Null
$log=Join-Path $env:TEMP 'AfriLife-Unity-Init.log'
$arguments=@('-batchmode','-quit','-createProject',('"' + $ProjectPath + '"'),
  '-cloneFromTemplate',('"' + $template.FullName + '"'),'-logFile',('"' + $log + '"'))
Write-Host ('Creating AfriLife Universal 3D Unity project from ' + $template.Name)
$process=Start-Process -FilePath $UnityEditorPath -ArgumentList $arguments -PassThru -Wait
$manifest=Join-Path $ProjectPath 'Packages\manifest.json'
if($process.ExitCode -ne 0 -or -not(Test-Path $version) -or -not(Test-Path $manifest)){
  if(Test-Path $log){Get-Content $log -Tail 50}
  throw 'Unity could not initialize AfriLife project.'
}
if((Get-Content $manifest -Raw) -notmatch 'com\.unity\.render-pipelines\.universal'){
  throw 'Unity project was created without URP; select Universal 3D template.'
}
Write-Host ('AfriLife Unity 6 URP project created: ' + $ProjectPath)
