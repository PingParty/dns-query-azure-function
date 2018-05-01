foreach($region in Get-Content .\regions.txt) { 
    $region

    az group create --name dnsQuery-$region --location $region

    az storage account create --name dnsstorage$region --location $region `
      --resource-group dnsQuery-$region --sku Standard_LRS

    az functionapp create --deployment-source-url https://github.com/PingParty/dns-query-azure-function `
      --resource-group dnsQuery-$region --consumption-plan-location $region `
      --name dnsQuery-$region --storage-account dnsstorage$region  
}
