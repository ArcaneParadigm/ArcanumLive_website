# copy-lyrics.ps1 — find and copy lyrics for albums that missed them
# The Aether/ folder is the master catch-all for all Suno lyrics

$projectRoot = "C:\Users\arcan\Downloads\Claude Code\Arcanum Live"
$downloadsBase = "C:\Users\arcan\Downloads\Suno Downloads1"

# All lyric source dirs to search (broadest first)
$allLyricDirs = @(
  "$downloadsBase\Aether"
  "$downloadsBase\1_Suno_songs_Rim_liked2\ai_songs_from_theRim"
  "$downloadsBase\1_Suno_songs_Rim_liked2\ai_reallyliked2"
  "$downloadsBase\Sidhe Fairy song"
  "$downloadsBase\Ai_Divine2"
  "$downloadsBase\Ascencioncity"
  "$downloadsBase\1_SELECTS"
  "$downloadsBase\My Workspace"
  "$downloadsBase\My Workspace 2"
  "$downloadsBase\Egyptian_Dungeon"
  "$downloadsBase\Metaburn"
  "$downloadsBase\Metaburn_copy2"
)

# Pre-index all txt files for fast lookup
$txtIndex = @{}
foreach ($dir in $allLyricDirs) {
  if (-not (Test-Path $dir)) { continue }
  foreach ($txt in (Get-ChildItem -Path $dir -Filter "*.txt" -Recurse -ErrorAction SilentlyContinue)) {
    $key = $txt.BaseName -replace '\s*\(\d+\)$', '' -replace '\.wav$', ''
    $key = $key.ToLower().Trim()
    if (-not $txtIndex.ContainsKey($key)) {
      $txtIndex[$key] = $txt.FullName
    }
  }
}
Write-Host "Indexed $($txtIndex.Count) lyric files"

function Find-Lyrics($cleanName) {
  # Try exact match first, then strip version suffix
  $attempts = @(
    $cleanName.ToLower()
    ($cleanName -replace '\s+v\d+[a-z]*$', '').ToLower().Trim()
    ($cleanName -replace '\s+v\d+.*$', '').ToLower().Trim()
    ($cleanName -replace '\s*\(\d+\)$', '').ToLower().Trim()
  )
  foreach ($attempt in $attempts) {
    if ($txtIndex.ContainsKey($attempt)) { return $txtIndex[$attempt] }
    # Fuzzy: find key that contains the attempt
    foreach ($key in $txtIndex.Keys) {
      if ($key -like "*$attempt*" -or $attempt -like "*$key*") {
        return $txtIndex[$key]
      }
    }
  }
  return $null
}

$slugs = @(
  'songs-from-the-rim-1'
  'sidhe-fairy-songs-1'
  'songs-from-the-rim-ai-divine'
  'songs-from-the-rim-ascension-city'
  'movie-aether-into-the-multiverse'
)

foreach ($slug in $slugs) {
  $audioDir  = "$projectRoot\public\audio\albums\$slug"
  $lyricsDir = "$audioDir\lyrics"
  New-Item -ItemType Directory -Force -Path $lyricsDir | Out-Null

  $mp3s = Get-ChildItem -Path $audioDir -Filter "*.mp3" -ErrorAction SilentlyContinue | Sort-Object Name
  $found = 0; $missing = 0

  foreach ($mp3 in $mp3s) {
    $destTxt = "$lyricsDir\$($mp3.BaseName).txt"
    if (Test-Path $destTxt) { $found++; continue }

    # Strip leading number prefix from filename for matching
    $baseName = $mp3.BaseName -replace '^\d+[_ .]?\s*b?[_ .]?\s*', ''
    $src = Find-Lyrics $baseName
    if ($src) {
      Copy-Item -Path $src -Destination $destTxt
      $found++
    } else {
      Write-Host "  MISSING: $($mp3.BaseName)"
      $missing++
    }
  }
  Write-Host "$slug - found: $found  missing: $missing"
}
Write-Host "Done."
