# CatalogSmith Local Development Server (PowerShell)
# Serves the current directory on http://localhost:8080 without requiring Node or Python.

param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "`n CatalogSmith Local Server running at: $prefix" -ForegroundColor Green
    Write-Host " Serving files from: $PSScriptRoot" -ForegroundColor Cyan
    Write-Host " Press Ctrl+C in this terminal to stop the server.`n" -ForegroundColor Yellow

    # Start-Process "$prefix"

    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".htm"  = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".svg"  = "image/svg+xml"
        ".ico"  = "image/x-icon"
        ".pdf"  = "application/pdf"
        ".zip"  = "application/zip"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # Handle Image Search API Endpoint locally
        if ($rawPath -eq "api/search-images") {
            $query = $request.QueryString["q"]
            if ([string]::IsNullOrWhiteSpace($query)) {
                $query = $request.QueryString["query"]
            }

            if ([string]::IsNullOrWhiteSpace($query)) {
                $response.StatusCode = 400
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Missing query parameter q"}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            try {
                $cleanQ = [uri]::EscapeDataString($query.Trim())
                $wikiUrl = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$cleanQ&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&format=json&origin=*"
                $wikiRes = Invoke-RestMethod -Uri $wikiUrl -Headers @{"User-Agent"="CatalogSmithLocalDev/1.0"}
                $results = @()
                if ($wikiRes.query -and $wikiRes.query.pages) {
                    foreach ($prop in $wikiRes.query.pages.PSObject.Properties) {
                        $p = $prop.Value
                        if ($p.imageinfo -and $p.imageinfo.Count -gt 0) {
                            $info = $p.imageinfo[0]
                            $meta = $info.extmetadata
                            $cleanTitle = $p.title -replace '^File:', '' -replace '\.[^.]+$', '' -replace '[-_]', ' '
                            $lic = if ($meta -and $meta.LicenseShortName) { $meta.LicenseShortName.value } else { 'Creative Commons' }
                            $auth = if ($meta -and $meta.Artist) { ($meta.Artist.value -replace '<[^>]+>', '') } else { 'Wikimedia Commons' }

                            $results += @{
                                id = $p.pageid.ToString()
                                title = $cleanTitle.Substring(0, [Math]::Min(70, $cleanTitle.Length))
                                imageUrl = $info.url
                                thumbnailUrl = if ($info.thumburl) { $info.thumburl } else { $info.url }
                                sourceUrl = if ($info.descriptionurl) { $info.descriptionurl } else { $info.url }
                                publisher = 'Wikimedia Commons'
                                dimensions = ($info.width.ToString() + ' × ' + $info.height.ToString())
                                attribution = ($auth + ' (' + $lic + ')')
                            }
                        }
                    }
                }

                $jsonObj = @{
                    provider = "wikimedia"
                    query = $query
                    total = $results.Count
                    results = $results
                }
                $jsonStr = $jsonObj | ConvertTo-Json -Depth 4
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            } catch {
                $response.StatusCode = 500
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Search failed","results":[]}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
        }

        $filePath = Join-Path $PSScriptRoot $rawPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
            $response.ContentLength64 = $errorMsg.Length
            $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
        }

        $response.Close()
    }
}
catch {
    Write-Error $_
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
