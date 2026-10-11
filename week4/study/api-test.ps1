# 4주차 ORM 도서 API 자동 점검 스크립트
# 실행 (study-orm 폴더에서): powershell -ExecutionPolicy Bypass -File .\api-test.ps1
# 하는 일: bootJar 빌드 → 서버 실행 → GET/POST/오류 요청 → 결과를 api-test-result.md에 저장 → 서버 종료 → gradlew test
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

$resultPath = Join-Path $PSScriptRoot 'api-test-result.md'
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

function Invoke-Api([string]$Name, [string]$Method, [string]$Path, [string]$Body) {
    $params = @{ Uri = "http://localhost:8080$Path"; Method = $Method; UseBasicParsing = $true; TimeoutSec = 15 }
    if ($Body) {
        $params.ContentType = 'application/json; charset=utf-8'
        $params.Body = [Text.Encoding]::UTF8.GetBytes($Body)
    }
    try {
        $r = Invoke-WebRequest @params
        $status = [int]$r.StatusCode
        $content = [Text.Encoding]::UTF8.GetString($r.RawContentStream.ToArray())
    } catch {
        $resp = $_.Exception.Response
        if ($null -eq $resp) { $status = 0; $content = $_.Exception.Message }
        else {
            $status = [int]$resp.StatusCode
            if ($resp -is [System.Net.HttpWebResponse]) {
                $reader = New-Object System.IO.StreamReader($resp.GetResponseStream(), [Text.Encoding]::UTF8)
                $content = $reader.ReadToEnd()
            } else { $content = $_.ErrorDetails.Message }
        }
    }
    Add-Line "### $Name"
    Add-Line ''
    Add-Line "- 요청: ``$Method $Path``"
    if ($Body) { Add-Line "- Body: ``$Body``" }
    Add-Line "- 상태 코드: **$status**"
    Add-Line ''
    Add-Line '```json'
    Add-Line $content
    Add-Line '```'
    Add-Line ''
}

$app = $null
try {
    Add-Line '# 4주차 ORM API 점검 결과'
    Add-Line ''
    Add-Line ("- 실행 시각: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
    $javaHome = Find-JavaHome
    $env:JAVA_HOME = $javaHome
    Add-Line "- JDK: $javaHome"
    Add-Line ''

    Write-Host '[1/5] bootJar 빌드 중...'
    & .\gradlew.bat bootJar --console=plain
    if ($LASTEXITCODE -ne 0) { throw "bootJar 빌드 실패 (exit $LASTEXITCODE). 위 컴파일 오류를 확인해 주세요." }
    $jar = Get-ChildItem -Path (Join-Path $PSScriptRoot 'build\libs') -Filter '*.jar' | Where-Object { $_.Name -notlike '*-plain.jar' } | Select-Object -First 1

    $busy = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if ($busy) { throw '8080 포트를 이미 다른 프로그램(예: IntelliJ에서 실행 중인 3주차 서버)이 쓰고 있어요. 그 서버를 끄고 다시 실행해 주세요.' }

    Write-Host '[2/5] 서버 실행 중...'
    $javaExe = Join-Path $javaHome 'bin\java.exe'
    $app = Start-Process -FilePath $javaExe -ArgumentList @('-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-jar', ('"' + $jar.FullName + '"')) `
        -WorkingDirectory $PSScriptRoot -RedirectStandardOutput $logOut -RedirectStandardError $logErr -PassThru -WindowStyle Hidden
    $ready = $false
    for ($i = 0; $i -lt 90; $i++) {
        Start-Sleep -Seconds 1
        if ($app.HasExited) { break }
        try { Invoke-WebRequest -Uri 'http://localhost:8080/books' -UseBasicParsing -TimeoutSec 2 | Out-Null; $ready = $true; break } catch {
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

    Write-Host '[3/5] API 요청 중...'
    Add-Line '## API 요청 결과'
    Add-Line ''
    Invoke-Api '1. 도서 전체 조회 (등록 전)' 'GET' '/books' $null
    Invoke-Api '2. 도서 등록 성공' 'POST' '/books' '{"categoryId":1,"title":"ORM으로 등록한 책","description":"4주차 미션 테스트"}'
    Invoke-Api '3. 도서 전체 조회 (등록 후)' 'GET' '/books' $null
    Invoke-Api '4. 카테고리별 조회' 'GET' '/books/category/1' $null
    Invoke-Api '5. 없는 카테고리' 'POST' '/books' '{"categoryId":999,"title":"없는 카테고리 책","description":"오류 확인"}'
    Invoke-Api '6. 빈 제목' 'POST' '/books' '{"categoryId":1,"title":"","description":"오류 확인"}'
    Invoke-Api '7. 공백만 있는 제목' 'POST' '/books' '{"categoryId":1,"title":"   ","description":"오류 확인"}'
    Invoke-Api '8. categoryId 누락' 'POST' '/books' '{"title":"카테고리 없는 책"}'
    Invoke-Api '9. 제목 101자' 'POST' '/books' ('{"categoryId":1,"title":"' + ('가' * 101) + '"}')
    Invoke-Api '10. categoryId에 문자' 'POST' '/books' '{"categoryId":"abc","title":"타입 오류"}'
    Invoke-Api '11. 다른 카테고리 조회' 'GET' '/books/category/2' $null
} catch {
    Add-Line ''
    Add-Line "> 오류: $($_.Exception.Message)"
} finally {
    if ($app -and -not $app.HasExited) { Write-Host '[4/5] 서버 종료'; Stop-Process -Id $app.Id -Force }
    if (Test-Path $logOut) {
        Add-Line '## 서버 로그 (Hibernate SQL 포함, 마지막 150줄)'
        Add-Line ''
        Add-Line '```text'
        Add-Line ((Get-Content $logOut -Encoding UTF8 -Tail 150) -join "`n")
        Add-Line '```'
        Add-Line ''
    }
    Save-Result
}

Write-Host '[5/5] gradlew test 실행 중...'
& .\gradlew.bat test --console=plain
$testExit = $LASTEXITCODE
Add-Line '## gradlew test'
Add-Line ''
Add-Line ("- 결과: " + $(if ($testExit -eq 0) { '성공' } else { "실패 (exit $testExit) - build/reports/tests/test/index.html 확인" }))
Save-Result
Write-Host "완료: $resultPath"
