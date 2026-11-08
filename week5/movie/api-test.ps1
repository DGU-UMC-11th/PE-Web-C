# 5주차 영화 평점 API 자동 점검 스크립트 (Postman 요청과 같은 HTTP 요청 + CORS 헤더 확인)
# 실행 (movie 폴더에서):
#   powershell -ExecutionPolicy Bypass -File .\api-test.ps1               # 점검 후 서버 종료
#   powershell -ExecutionPolicy Bypass -File .\api-test.ps1 -KeepRunning  # 점검 후 서버를 켜 둔 채로 끝남 (웹 화면 연결 확인용)
param([switch]$KeepRunning)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

$resultPath = Join-Path $PSScriptRoot 'api-test-result.md'
New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot 'build') | Out-Null
$logOut = Join-Path $PSScriptRoot 'build\api-test-app.log'
$logErr = Join-Path $PSScriptRoot 'build\api-test-app.err.log'
$sb = New-Object System.Text.StringBuilder
function Add-Line([string]$text) { [void]$sb.AppendLine($text); Write-Host $text }
function Save-Result { [IO.File]::WriteAllText($resultPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false))) }

function Find-JavaHome {
    $candidates = @()
    $roots = @((Join-Path $HOME '.jdks'), 'C:\Program Files\Java', 'C:\Program Files\Eclipse Adoptium', 'C:\Program Files\Microsoft', 'C:\Program Files\Amazon Corretto', 'C:\Program Files\Zulu')
    foreach ($root in $roots) {
        if (Test-Path $root) {
            $candidates += Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -match '(^|[^0-9.])21([^0-9]|$)' -and (Test-Path (Join-Path $_.FullName 'bin\java.exe')) }
        }
    }
    if ($candidates.Count -gt 0) { return $candidates[0].FullName }
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { return $env:JAVA_HOME }
    throw 'Java 21 JDK를 찾지 못했어요. JAVA_HOME에 JDK 21 경로를 넣고 다시 실행해 주세요.'
}

function Invoke-Api([string]$Name, [string]$Method, [string]$Path, [hashtable]$Headers) {
    $params = @{ Uri = "http://localhost:8080$Path"; Method = $Method; UseBasicParsing = $true; TimeoutSec = 15 }
    if ($Headers) { $params.Headers = $Headers }
    $respHeaders = $null
    try {
        $r = Invoke-WebRequest @params
        $status = [int]$r.StatusCode
        $content = [Text.Encoding]::UTF8.GetString($r.RawContentStream.ToArray())
        $respHeaders = $r.Headers
    } catch {
        $resp = $_.Exception.Response
        if ($null -eq $resp) { $status = 0; $content = $_.Exception.Message }
        else {
            $status = [int]$resp.StatusCode
            $respHeaders = $resp.Headers
            if ($resp -is [System.Net.HttpWebResponse]) {
                $reader = New-Object System.IO.StreamReader($resp.GetResponseStream(), [Text.Encoding]::UTF8)
                $content = $reader.ReadToEnd()
            } else { $content = $_.ErrorDetails.Message }
        }
    }
    Add-Line "### $Name"
    Add-Line ''
    Add-Line "- 요청: ``$Method $Path``"
    if ($Headers) { foreach ($k in $Headers.Keys) { Add-Line "- 요청 헤더: ``${k}: $($Headers[$k])``" } }
    Add-Line "- 상태 코드: **$status**"
    foreach ($h in @('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Vary')) {
        $v = $null
        if ($respHeaders) { try { $v = $respHeaders[$h] } catch {} }
        if ($v) { Add-Line "- 응답 헤더: ``${h}: $v``" } elseif ($Headers -and $h -eq 'Access-Control-Allow-Origin') { Add-Line "- 응답 헤더: ``Access-Control-Allow-Origin`` 없음" }
    }
    Add-Line ''
    Add-Line '```json'
    Add-Line $content
    Add-Line '```'
    Add-Line ''
}

function Enc([string]$s) { [uri]::EscapeDataString($s) }

$app = $null
try {
    Add-Line '# 5주차 영화 평점 API 점검 결과'
    Add-Line ''
    Add-Line ("- 실행 시각: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
    $javaHome = Find-JavaHome
    $env:JAVA_HOME = $javaHome
    Add-Line "- JDK: $javaHome"
    Add-Line ''

    Write-Host '[1/4] bootJar 빌드 중...'
    & .\gradlew.bat bootJar --console=plain
    if ($LASTEXITCODE -ne 0) { throw "bootJar 빌드 실패 (exit $LASTEXITCODE). 위 컴파일 오류를 확인해 주세요." }
    $jar = Get-ChildItem -Path (Join-Path $PSScriptRoot 'build\libs') -Filter '*.jar' | Where-Object { $_.Name -notlike '*-plain.jar' } | Select-Object -First 1

    $busy = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if ($busy) { throw '8080 포트를 이미 다른 프로그램(예: IntelliJ에서 실행 중인 서버)이 쓰고 있어요. 그 서버를 끄고 다시 실행해 주세요.' }

    Write-Host '[2/4] 서버 실행 중...'
    $javaExe = Join-Path $javaHome 'bin\java.exe'
    $app = Start-Process -FilePath $javaExe -ArgumentList @('-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-jar', ('"' + $jar.FullName + '"')) `
        -WorkingDirectory $PSScriptRoot -RedirectStandardOutput $logOut -RedirectStandardError $logErr -PassThru -WindowStyle Hidden
    $ready = $false
    for ($i = 0; $i -lt 90; $i++) {
        Start-Sleep -Seconds 1
        if ($app.HasExited) { break }
        try { Invoke-WebRequest -Uri 'http://localhost:8080/members/nickname/ping' -UseBasicParsing -TimeoutSec 2 | Out-Null; $ready = $true; break } catch {
            if ($_.Exception.Response) { $ready = $true; break }
        }
    }
    if (-not $ready) {
        Add-Line '## 서버 시작 실패'
        Add-Line ''
        Add-Line '```text'
        if (Test-Path $logOut) { Add-Line ((Get-Content $logOut -Encoding UTF8 -Tail 80) -join "`n") }
        Add-Line '```'
        throw '서버가 시작되지 않았어요. api-test-result.md의 로그를 확인해 주세요.'
    }

    Write-Host '[3/4] API 요청 중...'
    Add-Line '## API 요청 결과 (Postman과 같은 요청)'
    Add-Line ''
    Invoke-Api '1. 닉네임 중복 체크 - 이미 있는 닉네임(수현)' 'GET' ('/members/nickname/' + (Enc '수현')) $null
    Invoke-Api '2. 닉네임 중복 체크 - 없는 닉네임(밍)' 'GET' ('/members/nickname/' + (Enc '밍')) $null
    Invoke-Api '3. 이메일 중복 체크 - 이미 있는 이메일' 'GET' '/members/email/noco@umc.com' $null
    Invoke-Api '4. 이메일 중복 체크 - 없는 이메일' 'GET' '/members/email/ming@umc.com' $null
    Invoke-Api '5. 유저별 평점 조회 - 1번 회원' 'GET' '/members/1/ratings' $null
    Invoke-Api '6. 유저별 평점 조회 - 2번 회원' 'GET' '/members/2/ratings' $null
    Invoke-Api '7. 유저별 평점 조회 - 없는 회원' 'GET' '/members/999/ratings' $null
    Invoke-Api '8. 유저별 평점 조회 - memberId에 문자' 'GET' '/members/abc/ratings' $null
    Add-Line '## CORS 확인'
    Add-Line ''
    Invoke-Api '9. 허용한 출처(http://localhost:5173)에서 온 요청' 'GET' '/members/nickname/noco' @{ Origin = 'http://localhost:5173' }
    Invoke-Api '10. 허용하지 않은 출처(http://localhost:3001)에서 온 요청' 'GET' '/members/nickname/noco' @{ Origin = 'http://localhost:3001' }
    Invoke-Api '11. Preflight(OPTIONS) - 허용한 출처' 'OPTIONS' '/members/1/ratings' @{ Origin = 'http://localhost:5173'; 'Access-Control-Request-Method' = 'GET' }
} catch {
    Add-Line ''
    Add-Line "> 오류: $($_.Exception.Message)"
} finally {
    if ($app -and -not $app.HasExited) {
        if ($KeepRunning) { Write-Host "[4/4] 서버를 켜 둔 채로 끝내요 (PID $($app.Id)). 끄려면: Stop-Process -Id $($app.Id)" }
        else { Write-Host '[4/4] 서버 종료'; Stop-Process -Id $app.Id -Force }
    }
    if (Test-Path $logOut) {
        Add-Line '## 서버 로그 (Hibernate SQL 포함, 마지막 120줄)'
        Add-Line ''
        Add-Line '```text'
        Add-Line ((Get-Content $logOut -Encoding UTF8 -Tail 120) -join "`n")
        Add-Line '```'
    }
    Save-Result
}
Write-Host "완료: $resultPath"
