foreach($region in Get-Content .\regions.txt) { 
    $region
    az group delete --name dnsQuery-$region --yes
}
