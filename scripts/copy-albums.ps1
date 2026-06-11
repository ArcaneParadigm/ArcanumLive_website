# copy-albums.ps1
# Converts masterforge WAV → MP3 320k, copies matching lyrics txt
# Run: powershell -ExecutionPolicy Bypass -File scripts/copy-albums.ps1

$projectRoot = "C:\Users\arcan\Downloads\Claude Code\Arcanum Live"
$downloadsBase = "C:\Users\arcan\Downloads\Suno Downloads1"

$albums = @(
  @{
    slug       = "songs-from-the-rim-1"
    masterDir  = "$downloadsBase\_Albums\1_Songs from the Rim 1\masterforge-batch-export"
    lyricDirs  = @(
      "$downloadsBase\1_Suno_songs_Rim_liked2\ai_songs_from_theRim"
      "$downloadsBase\1_Suno_songs_Rim_liked2\ai_reallyliked2"
    )
  }
  @{
    slug       = "sidhe-fairy-songs-1"
    masterDir  = "$downloadsBase\_Albums\Sidhe Fairy Songs 1\masterforge-batch-export"
    lyricDirs  = @("$downloadsBase\Sidhe Fairy song")
  }
  @{
    slug       = "songs-from-the-rim-ai-divine"
    masterDir  = "$downloadsBase\_Albums\Songs from the Rim Ai divine\masterforge-batch-export"
    lyricDirs  = @("$downloadsBase\Ai_Divine2")
  }
  @{
    slug       = "songs-from-the-rim-ascension-city"
    masterDir  = "$downloadsBase\_Albums\Songs from the Rim Ascension city\masterforge-batch-export"
    lyricDirs  = @("$downloadsBase\Ascencioncity")
  }
  @{
    slug       = "movie-aether-into-the-multiverse"
    masterDir  = "$downloadsBase\_Albums\_Movie_Aether  Into the Multiverse\masterforge-batch-export"
    lyricDirs  = @("$downloadsBase\Aether")
  }
)

foreach ($album in $albums) {
  $outDir = "$projectRoot\public\audio\albums\$($album.slug)"
  $lyricsDir = "$outDir\lyrics"
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  New-Item -ItemType Directory -Force -Path $lyricsDir | Out-Null

  $wavFiles = Get-ChildItem -Path $album.masterDir -Filter "*.wav" | Sort-Object Name
  Write-Host "`n=== $($album.slug) ($($wavFiles.Count) tracks) ==="

  foreach ($wav in $wavFiles) {
    # Strip -MFmaster_-XX.XL suffix to get clean output name
    $cleanName = $wav.BaseName -replace '-MFmaster_-[\d.]+L.*', ''
    # Also strip double-MFmaster (movie album has double-mastered files)
    $cleanName = $cleanName -replace '-MFmaster_-[\d.]+L.*', ''
    $cleanName = $cleanName.TrimEnd(' -_')
    $mp3Out = "$outDir\$cleanName.mp3"

    if (Test-Path $mp3Out) {
      Write-Host "  SKIP (exists): $cleanName.mp3"
    } else {
      Write-Host "  CONVERT: $cleanName"
      & ffmpeg -y -i $wav.FullName -codec:a libmp3lame -qscale:a 0 -b:a 320k "$mp3Out" -loglevel error
    }

    # Find matching lyrics — look for txt with same base name (minus track number prefix)
    $baseName = $cleanName -replace '^\d+[_ .]?\s*', ''  # strip leading number
    $found = $false
    foreach ($lyricDir in $album.lyricDirs) {
      if (-not (Test-Path $lyricDir)) { continue }
      $txts = Get-ChildItem -Path $lyricDir -Filter "*.txt" -ErrorAction SilentlyContinue
      foreach ($txt in $txts) {
        $txtBase = $txt.BaseName -replace '\s*\(\d+\)$', ''  # strip (1),(2)
        $txtBase = $txtBase -replace '\.wav$', ''             # strip .wav extension if present
        if ($txtBase -like "*$baseName*" -or $baseName -like "*$($txtBase)*") {
          $dest = "$lyricsDir\$cleanName.txt"
          if (-not (Test-Path $dest)) {
            Copy-Item -Path $txt.FullName -Destination $dest
            Write-Host "    lyrics: $($txt.Name) -> $cleanName.txt"
          }
          $found = $true
          break
        }
      }
      if ($found) { break }
    }
    if (-not $found) {
      Write-Host "    (no lyrics found for: $baseName)"
    }
  }
}

Write-Host "`nDone."
