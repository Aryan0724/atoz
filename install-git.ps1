$response = Invoke-RestMethod -Uri "https://api.github.com/repos/git-for-windows/git/releases/latest"
$url = ($response.assets | Where-Object name -match 'Git-.*-64-bit\.exe$')[0].browser_download_url
Write-Output "Downloading $url"
Invoke-WebRequest -Uri $url -OutFile "git-installer.exe"
Write-Output "Installing Git..."
Start-Process -FilePath ".\git-installer.exe" -ArgumentList "/SILENT" -Wait
Remove-Item ".\git-installer.exe"
Write-Output "Done"
