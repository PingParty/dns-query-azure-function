foreach($region in Get-Content .\regions.txt) { 
    $region

    az functionapp deployment source sync --name dnsQuery-$region --resource-group dnsQuery-$region
}
