# Premium Native PowerShell Web Server for Sreelakshmi A. Portfolio
# Running on http://localhost:5173

$port = 5173
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  Sreelakshmi A. Portfolio Development Server Ready!   " -ForegroundColor Green -BackgroundColor Black
    Write-Host "  Local URL: http://localhost:$port                       " -ForegroundColor White -BackgroundColor DarkGreen
    Write-Host "  Press Ctrl+C in your terminal to stop the server        " -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
} catch {
    Write-Host "Error starting HTTP server: $_" -ForegroundColor Red
    Write-Host "Attempting port 8080 instead..." -ForegroundColor Yellow
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "Server running at: http://localhost:$port" -ForegroundColor Green
}

$currentDir = Get-Location

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/" -or $url.EndsWith("/")) {
            $url = $url + "index.html"
        }
        
        # Resolve file path relative to this script directory
        $filePath = Join-Path $currentDir.Path $url.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            # Determine correct content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "text/plain"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".svg"  { $mime = "image/svg+xml" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".gif"  { $mime = "image/gif" }
                ".ico"  { $mime = "image/x-icon" }
                ".woff" { $mime = "font/woff" }
                ".woff2" { $mime = "font/woff2" }
                ".ttf"  { $mime = "font/ttf" }
            }
            
            # Read and write file contents
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            
            Write-Host "[200] served: $url ($($bytes.Length) bytes) - $mime" -ForegroundColor Gray
        } else {
            # 404 response
            $response.StatusCode = 404
            $errText = "404 - File Not Found: $url"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errText)
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            
            Write-Host "[404] not found: $url" -ForegroundColor Red
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Server interrupted or closed: $_" -ForegroundColor Yellow
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "Server stopped." -ForegroundColor Red
}
