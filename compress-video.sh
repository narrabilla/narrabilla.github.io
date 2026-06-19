#!/usr/bin/env bash
# =============================================================
# compress-video.sh — make any video web + GitHub Pages ready.
#
# Turns a big/raw clip into a small H.264 MP4 (plays everywhere,
# stays under GitHub's 100MB file limit) and grabs a poster image.
#
# Usage:
#   ./compress-video.sh "My Raw Clip.mov"  my-clip
#                         ^ input file       ^ output name (no extension)
#
# Produces:
#   assets/video/my-clip.mp4
#   assets/img/my-clip-poster.jpg
#
# Requires ffmpeg:  brew install ffmpeg
# =============================================================
set -euo pipefail

INPUT="${1:-}"
NAME="${2:-}"

if [[ -z "$INPUT" || -z "$NAME" ]]; then
  echo "Usage: ./compress-video.sh \"input.mp4\" output-name"
  exit 1
fi
if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg not found. Install it with:  brew install ffmpeg"
  exit 1
fi

mkdir -p assets/video assets/img

echo "→ Compressing video…"
ffmpeg -y -hide_banner -loglevel error -i "$INPUT" \
  -c:v libx264 -profile:v high -preset slow -crf 27 \
  -maxrate 4M -bufsize 8M -pix_fmt yuv420p \
  -c:a aac -b:a 112k -movflags +faststart \
  "assets/video/${NAME}.mp4"

echo "→ Grabbing poster frame…"
ffmpeg -y -hide_banner -loglevel error -ss 2 -i "$INPUT" \
  -frames:v 1 -q:v 3 "assets/img/${NAME}-poster.jpg"

SIZE=$(du -h "assets/video/${NAME}.mp4" | cut -f1)
echo "✅ Done — assets/video/${NAME}.mp4 (${SIZE})"
echo "   Now add a <figure class=\"vcard\"> block in index.html pointing at it."
