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
        if ([string]::IsNullOrWhiteSpace($rawPath) -or $rawPath -eq "undefined" -or $rawPath.StartsWith("store/")) {
            $rawPath = "index.html"
        }

        # Handle Catalogs API Endpoint locally
        if ($rawPath -eq "api/catalogs") {
            $dataDir = Join-Path $PSScriptRoot "data"
            $dataFile = Join-Path $dataDir "catalogs.json"
            if (-not (Test-Path $dataDir)) {
                New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
            }
            if (-not (Test-Path $dataFile)) {
                Set-Content -Path $dataFile -Value "[]" -Encoding UTF8
            }

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
                $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
                $response.Close()
                continue
            }

            if ($request.HttpMethod -eq "GET") {
                $targetId = $request.QueryString["id"]
                $content = Get-Content -Path $dataFile -Raw -Encoding UTF8
                if ([string]::IsNullOrWhiteSpace($content)) { $content = "[]" }

                if (-not [string]::IsNullOrWhiteSpace($targetId)) {
                    $cleanTarget = $targetId.Trim().ToLower()
                    if ($cleanTarget -eq "undefined" -or $cleanTarget -eq "null") {
                        $response.StatusCode = 404
                        $response.ContentType = "application/json; charset=utf-8"
                        $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid catalog identifier"}')
                        $response.ContentLength64 = $bytes.Length
                        $response.OutputStream.Write($bytes, 0, $bytes.Length)
                        $response.Close()
                        continue
                    }

                    $allCats = $content | ConvertFrom-Json
                    if ($allCats -isnot [System.Array]) { $allCats = @($allCats) }
                    $foundCat = $null
                    foreach ($c in $allCats) {
                        $cId = if ($c.id) { $c.id.ToString().ToLower() } else { "" }
                        $cSlug = if ($c.slug) { $c.slug.ToString().ToLower() } else { "" }
                        if ($cId -eq $cleanTarget -or $cSlug -eq $cleanTarget) {
                            $foundCat = $c
                            break
                        }
                    }
                    if ($foundCat) {
                        $foundJson = $foundCat | ConvertTo-Json -Depth 10
                        $bytes = [System.Text.Encoding]::UTF8.GetBytes($foundJson)
                        $response.StatusCode = 200
                        $response.ContentType = "application/json; charset=utf-8"
                        $response.AddHeader("Access-Control-Allow-Origin", "*")
                        $response.ContentLength64 = $bytes.Length
                        $response.OutputStream.Write($bytes, 0, $bytes.Length)
                        $response.Close()
                        continue
                    } else {
                        $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Catalog not found"}')
                        $response.StatusCode = 404
                        $response.ContentType = "application/json; charset=utf-8"
                        $response.AddHeader("Access-Control-Allow-Origin", "*")
                        $response.ContentLength64 = $notFoundBytes.Length
                        $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                        $response.Close()
                        continue
                    }
                }

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            if ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()

                try {
                    $postedCatalog = $body | ConvertFrom-Json
                    $existingRaw = Get-Content -Path $dataFile -Raw -Encoding UTF8
                    $existing = if ([string]::IsNullOrWhiteSpace($existingRaw)) { @() } else { $existingRaw | ConvertFrom-Json }
                    if ($existing -isnot [System.Array]) { $existing = @($existing) }

                    $updated = @()
                    $found = $false
                    foreach ($item in $existing) {
                        if ($item.id -eq $postedCatalog.id) {
                            $updated += $postedCatalog
                            $found = $true
                        } else {
                            $updated += $item
                        }
                    }
                    if (-not $found) {
                        $updated += $postedCatalog
                    }

                    $jsonStr = $updated | ConvertTo-Json -Depth 10
                    Set-Content -Path $dataFile -Value $jsonStr -Encoding UTF8

                    $respBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.AddHeader("Access-Control-Allow-Origin", "*")
                    $response.ContentLength64 = $respBytes.Length
                    $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                    $response.Close()
                    continue
                } catch {
                    $msg = $_.Exception.Message -replace '"', '\"'
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes(("{""error"":""Failed to save catalog: {0}""}" -f $msg))
                    $response.StatusCode = 500
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.AddHeader("Access-Control-Allow-Origin", "*")
                    $response.ContentLength64 = $errBytes.Length
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                    $response.Close()
                    continue
                }
            }

            if ($request.HttpMethod -eq "DELETE") {
                $delId = $request.QueryString["id"]
                if (-not [string]::IsNullOrWhiteSpace($delId)) {
                    $existingRaw = Get-Content -Path $dataFile -Raw -Encoding UTF8
                    $existing = if ([string]::IsNullOrWhiteSpace($existingRaw)) { @() } else { $existingRaw | ConvertFrom-Json }
                    if ($existing -isnot [System.Array]) { $existing = @($existing) }
                    $updated = @($existing | Where-Object { $_.id -ne $delId })
                    $jsonStr = $updated | ConvertTo-Json -Depth 10
                    Set-Content -Path $dataFile -Value $jsonStr -Encoding UTF8
                }
                $respBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $respBytes.Length
                $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                $response.Close()
                continue
            }
        }

        # Handle Image Search API Endpoint locally
        if ($rawPath -eq "api/search-images") {
            $t0 = [DateTime]::UtcNow
            $query = $request.QueryString["q"]
            if ([string]::IsNullOrWhiteSpace($query)) {
                $query = $request.QueryString["query"]
            }
            $isDebug = ($request.QueryString["debug"] -eq "1" -or $request.QueryString["debug"] -eq "true")

            if ([string]::IsNullOrWhiteSpace($query)) {
                $response.StatusCode = 400
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Missing query parameter q","results":[]}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            # Parse page parameter
            $page = 1
            if ($request.QueryString["page"]) {
                $pVal = 1
                if ([int]::TryParse($request.QueryString["page"], [ref]$pVal)) {
                    $page = [Math]::Max(1, $pVal)
                }
            }

            # Clean query for maximum provider relevance
            $cleanQ = $query.Trim()
            $cleanQ = [System.Text.RegularExpressions.Regex]::Replace($cleanQ, '(?i)\b\d+(k|thousand|naira|usd)\b', '')
            $cleanQ = [System.Text.RegularExpressions.Regex]::Replace($cleanQ, '(?i)\b(size\s*\d+|xl|xxl|small|medium|large)\b', '')
            $cleanQ = [System.Text.RegularExpressions.Regex]::Replace($cleanQ, '(?i)\b(product|photo|picture|images?|for\s+sale|buy|online)\b', '')
            $cleanQ = [System.Text.RegularExpressions.Regex]::Replace($cleanQ, '[&+,/\\()]+', ' ')
            $cleanQ = [System.Text.RegularExpressions.Regex]::Replace($cleanQ, '\s+', ' ').Trim()
            if ([string]::IsNullOrWhiteSpace($cleanQ)) { $cleanQ = $query.Trim() }

            $results = @()
            $primaryProvider = "none"
            $diagnostics = @()

            # 1. Try Openverse API (Commercial Creative Commons & Public Domain) with page pagination
            $ovStart = [DateTime]::UtcNow
            try {
                $ovEscaped = [uri]::EscapeDataString($cleanQ)
                $ovUrl = "https://api.openverse.org/v1/images/?q=$ovEscaped&license_type=commercial&page_size=12&page=$page"
                $ovRes = Invoke-RestMethod -Uri $ovUrl -Headers @{ "User-Agent" = "ContentSmithLocal/1.0" } -TimeoutSec 5
                $ovMs = ([DateTime]::UtcNow - $ovStart).TotalMilliseconds
                $ovItems = @($ovRes.results)
                $diagnostics += @{ provider = "openverse"; configured = $true; status = "ok"; result_count = $ovItems.Count; duration_ms = [int]$ovMs }

                if ($ovItems.Count -gt 0) {
                    $primaryProvider = "openverse"
                    foreach ($item in $ovItems) {
                        $auth = if ($item.creator) { $item.creator } else { "Openverse Creator" }
                        $lic = if ($item.license) { $item.license.ToUpper() } else { "CC" }
                        $results += @{
                            id = ("ov_" + $item.id)
                            thumb_url = if ($item.thumbnail) { $item.thumbnail } else { $item.url }
                            image_url = $item.url
                            source_url = if ($item.foreign_landing_url) { $item.foreign_landing_url } else { $item.url }
                            provider = "openverse"
                            title = if ($item.title) { $item.title } else { $cleanQ }
                            author = $auth
                            license = $lic
                            license_url = if ($item.license_url) { $item.license_url } else { "https://creativecommons.org/" }
                            commercial_ok = $true
                            width = if ($item.width) { $item.width } else { 0 }
                            height = if ($item.height) { $item.height } else { 0 }
                            attribution = ($auth + " • " + $lic + " via Openverse")
                        }
                    }
                }
            } catch {
                $ovMs = ([DateTime]::UtcNow - $ovStart).TotalMilliseconds
                $diagnostics += @{ provider = "openverse"; configured = $true; status = "error"; error = $_.Exception.Message; result_count = 0; duration_ms = [int]$ovMs }
            }

            # 2. Fallback to Wikimedia Commons if Openverse returned 0 results
            if ($results.Count -eq 0) {
                $wmStart = [DateTime]::UtcNow
                try {
                    $wmEscaped = [uri]::EscapeDataString($cleanQ)
                    $wmOffset = ($page - 1) * 12
                    $wikiUrl = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$wmEscaped&gsrnamespace=6&gsrlimit=12&gsroffset=$wmOffset&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&format=json&origin=*"
                    $wikiRes = Invoke-RestMethod -Uri $wikiUrl -Headers @{ "User-Agent" = "ContentSmithLocal/1.0" } -TimeoutSec 5
                    $wmMs = ([DateTime]::UtcNow - $wmStart).TotalMilliseconds
                    $wmCount = 0

                    if ($wikiRes.query -and $wikiRes.query.pages) {
                        $primaryProvider = "wikimedia"
                        foreach ($prop in $wikiRes.query.pages.PSObject.Properties) {
                            $p = $prop.Value
                            if ($p.imageinfo -and $p.imageinfo.Count -gt 0) {
                                $info = $p.imageinfo[0]
                                $meta = $info.extmetadata
                                $cleanTitle = $p.title -replace '^File:', '' -replace '\.[^.]+$', '' -replace '[-_]', ' '
                                $lic = if ($meta -and $meta.LicenseShortName) { $meta.LicenseShortName.value } else { 'Creative Commons' }
                                $auth = if ($meta -and $meta.Artist) { ($meta.Artist.value -replace '<[^>]+>', '') } else { 'Wikimedia Commons' }

                                $results += @{
                                    id = ("wm_" + $p.pageid)
                                    thumb_url = if ($info.thumburl) { $info.thumburl } else { $info.url }
                                    image_url = $info.url
                                    source_url = if ($info.descriptionurl) { $info.descriptionurl } else { $info.url }
                                    provider = "wikimedia"
                                    title = $cleanTitle.Substring(0, [Math]::Min(70, $cleanTitle.Length))
                                    author = $auth
                                    license = $lic
                                    license_url = "https://commons.wikimedia.org/"
                                    commercial_ok = (-not ($lic.ToLower().Contains("noncommercial")))
                                    width = if ($info.width) { $info.width } else { 0 }
                                    height = if ($info.height) { $info.height } else { 0 }
                                    attribution = ($auth + " (" + $lic + ") via Wikimedia Commons")
                                }
                                $wmCount++
                            }
                        }
                    }
                    $diagnostics += @{ provider = "wikimedia"; configured = $true; status = "ok"; result_count = $wmCount; duration_ms = [int]$wmMs }
                } catch {
                    $wmMs = ([DateTime]::UtcNow - $wmStart).TotalMilliseconds
                    $diagnostics += @{ provider = "wikimedia"; configured = $true; status = "error"; error = $_.Exception.Message; result_count = 0; duration_ms = [int]$wmMs }
                }
            }

            $totalMs = ([DateTime]::UtcNow - $t0).TotalMilliseconds
            $jsonObj = @{
                query = $cleanQ
                original_query = $query
                page = $page
                total = $results.Count
                commercial_only = $true
                primary_provider = $primaryProvider
                results = $results
            }
            if ($isDebug) {
                $jsonObj["debug"] = @{
                    total_time_ms = [int]$totalMs
                    diagnostics = $diagnostics
                }
            }

            $jsonStr = $jsonObj | ConvertTo-Json -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
            $response.StatusCode = 200
            $response.ContentType = "application/json; charset=utf-8"
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # Handle Image Import API Endpoint locally
        if ($rawPath -eq "api/import-image") {
            $targetUrl = $request.QueryString["url"]
            if ([string]::IsNullOrWhiteSpace($targetUrl) -and $request.HasEntityBody) {
                try {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                    $bodyRaw = $reader.ReadToEnd()
                    $parsedBody = $bodyRaw | ConvertFrom-Json
                    $targetUrl = $parsedBody.url
                } catch {}
            }

            if ([string]::IsNullOrWhiteSpace($targetUrl)) {
                $response.StatusCode = 400
                $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Missing required url parameter"}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            try {
                $uri = [System.Uri]$targetUrl
                if ($uri.Scheme -ne "https") {
                    throw "Only HTTPS image URLs are supported."
                }
                $allowedSuffixes = @('openverse.org', 'wp.com', 'wordpress.org', 'wikimedia.org', 'pexels.com', 'pixabay.com', 'unsplash.com', 'staticflickr.com', 'flickr.com')
                $hostLower = $uri.Host.ToLowerInvariant()
                $isAllowed = $false
                foreach ($suf in $allowedSuffixes) {
                    if ($hostLower -eq $suf -or $hostLower.EndsWith(".$suf")) {
                        $isAllowed = $true
                        break
                    }
                }
                if (-not $isAllowed) {
                    throw "Host $hostLower is not in the allowed commercial providers list."
                }

                $wc = New-Object System.Net.WebClient
                $wc.Headers.Add("User-Agent", "ContentSmith-ImageImporter/1.0")
                $imgBytes = $wc.DownloadData($uri)
                if ($imgBytes.Length -gt 5242880) {
                    throw "Image exceeds 5MB limit."
                }
                $b64 = [Convert]::ToBase64String($imgBytes)
                $mime = "image/jpeg"
                if ($uri.AbsolutePath.EndsWith(".png")) { $mime = "image/png" }
                elseif ($uri.AbsolutePath.EndsWith(".webp")) { $mime = "image/webp" }
                $dataUrl = "data:$mime;base64,$b64"

                $resObj = @{
                    ok = $true
                    stored_url = $dataUrl
                    is_blob = $false
                    size_bytes = $imgBytes.Length
                    content_type = $mime
                }
                $jsonStr = $resObj | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
            catch {
                $errMsg = $_.ToString().Replace('"', '\"')
                $status = 500
                if ($errMsg -like "*HTTPS*") { $status = 400 }
                elseif ($errMsg -like "*allowed*") { $status = 403 }
                elseif ($errMsg -like "*5MB*") { $status = 413 }
                $response.StatusCode = $status
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("{""error"":""$errMsg""}")
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
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
