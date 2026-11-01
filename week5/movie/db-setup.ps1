# 5주차 DB 준비 스크립트: umc_movie 데이터베이스와 member/rating/favorite 테이블, 시드 데이터를 만들어요.
# 실행 (movie 폴더에서): powershell -ExecutionPolicy Bypass -File .\db-setup.ps1
# MySQL Workbench를 쓴다면 이 스크립트 대신 sql\01_schema.sql, sql\02_seed.sql을 차례로 실행해도 돼요.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$envValues = @{}
Get-Content -LiteralPath (Join-Path $PSScriptRoot '.env') -Encoding UTF8 | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_]+)\s*=\s*(.*)$') { $envValues[$Matches[1]] = $Matches[2].Trim() }
}
$user = if ($envValues['DB_USERNAME']) { $envValues['DB_USERNAME'] } else { 'root' }
$password = $envValues['DB_PASSWORD']

$mysql = Get-Command mysql -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $mysql) {
    $mysql = Get-ChildItem -Path 'C:\Program Files\MySQL' -Recurse -Filter 'mysql.exe' -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -match '\\bin\\mysql\.exe$' } | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $mysql) { throw 'mysql.exe를 찾지 못했어요. MySQL Workbench에서 sql\01_schema.sql, sql\02_seed.sql을 실행해 주세요.' }
Write-Host "mysql: $mysql"

# 비밀번호를 명령줄에 노출하지 않도록 임시 설정 파일로 넘겨요.
$cnf = Join-Path $env:TEMP ("umc-movie-" + [guid]::NewGuid().ToString() + ".cnf")
[IO.File]::WriteAllText($cnf, "[client]`nuser=$user`npassword=$password`nhost=localhost`nport=3306`ndefault-character-set=utf8mb4`n", (New-Object System.Text.UTF8Encoding($false)))
# Windows PowerShell 5.1은 외부 프로그램에 넘기는 문자열을 기본 ASCII로 보내서 한글이 ?로 깨져요. UTF-8로 맞춰요.
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
try {
    foreach ($file in @('sql\01_schema.sql', 'sql\02_seed.sql')) {
        Write-Host "실행: $file"
        Get-Content -LiteralPath $file -Raw -Encoding UTF8 | & $mysql "--defaults-extra-file=$cnf"
        if ($LASTEXITCODE -ne 0) { throw "$file 실행 실패 (exit $LASTEXITCODE)" }
    }
    Write-Host '확인:'
    "USE umc_movie; SHOW TABLES; SELECT member_id, email, nickname FROM member; SELECT rating_id, member_id, movie_id, score, comment FROM rating;" | & $mysql "--defaults-extra-file=$cnf" --table
} finally {
    Remove-Item -LiteralPath $cnf -Force -ErrorAction SilentlyContinue
}
