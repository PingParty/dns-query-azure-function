az functionapp list-consumption-locations | ConvertFrom-Json | Write-Output | foreach { 
    $env:region = $_.name

    az functionapp deployment source sync --name dnsQuery-$env:region --resource-group dnsQuery-$env:region
}
