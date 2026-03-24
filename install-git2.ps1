$url = "https://github.com/git-for-windows/git/releases/download/v2.46.2.windows.1/Git-2.46.2-64-bit.exe"
Write-Output "Downloading $url"
Invoke-WebRequest -Uri $url -OutFile "git-installer.exe"
Write-Output "Installing Git..."
Start-Process -FilePath ".\git-installer.exe" -ArgumentList "/SILENT" -Wait
Remove-Item ".\git-installer.exe"
Write-Output "Done"
