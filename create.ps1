$env:region = 'eastus'

az group create --name dnsQuery-$env:region --location $env:region

az storage account create --name dnsstorage$env:region --location $env:region `
  --resource-group dnsQuery-$env:region --sku Standard_LRS

az functionapp create --deployment-source-url https://github.com/PingParty/dns-query-azure-function `
--resource-group dnsQuery-$env:region --consumption-plan-location $env:region `
--name dnsQuery-$env:region --storage-account dnsstorage$env:region  