$ErrorActionPreference = 'Stop'

$services = @(
    @{ Name = 'api-gateway'; Port = 8090 },
    @{ Name = 'product-service'; Port = 8091 },
    @{ Name = 'order-service'; Port = 8092 },
    @{ Name = 'account-service'; Port = 8093 }
)

foreach ($service in $services) {
    $modulePath = Join-Path $PSScriptRoot $service.Name
    Start-Process powershell.exe -ArgumentList @(
        '-NoExit'
        '-Command'
        "Set-Location -LiteralPath '$modulePath'; Write-Host 'Starting $($service.Name) on port $($service.Port)...'; mvn spring-boot:run"
    )
}

Write-Host 'Backend services are starting in separate PowerShell windows.'
Write-Host 'Gateway:  http://localhost:8090'
Write-Host 'Products: http://localhost:8091'
Write-Host 'Orders:   http://localhost:8092'
Write-Host 'Accounts: http://localhost:8093'
