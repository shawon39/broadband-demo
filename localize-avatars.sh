#!/usr/bin/env bash
# One-time helper: download the 4 video-call headshots into assets/ and point
# index.html at the local files instead of the Pexels CDN URLs.
# Run from anywhere:  bash localize-avatars.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$ROOT/assets"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36"

names=(tom-taylor colin-chamberlain steve-jones rachel-adams)
urls=(
  "https://images.pexels.com/photos/36713031/pexels-photo-36713031/free-photo-of-smiling-man-taking-a-selfie-indoors-at-home.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
  "https://images.pexels.com/photos/23224712/pexels-photo-23224712/free-photo-of-portrait-of-smiling-man-in-shirt.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
  "https://images.pexels.com/photos/5970877/pexels-photo-5970877.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
  "https://images.pexels.com/photos/7516247/pexels-photo-7516247.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
)

for i in "${!names[@]}"; do
  curl -L --fail -A "$UA" -o "$ASSETS/${names[$i]}.jpg" "${urls[$i]}"
  echo "saved assets/${names[$i]}.jpg"
done

# Repoint the 4 video tiles in index.html to the local files.
python3 - "$ROOT/index.html" <<'PY'
import sys, re
path = sys.argv[1]
src = open(path, encoding="utf-8").read()
local = {
    "av-tom":    "assets/tom-taylor.jpg",
    "av-colin":  "assets/colin-chamberlain.jpg",
    "av-steve":  "assets/steve-jones.jpg",
    "av-rachel": "assets/rachel-adams.jpg",
}
for cls, p in local.items():
    src = re.sub(
        r"(vp-avatar " + cls + r'" style="background-image:url\(\')[^\']*(\'\))',
        r"\g<1>" + p + r"\g<2>",
        src,
    )
open(path, "w", encoding="utf-8").write(src)
print("index.html now references the local assets/ files")
PY

echo "Done — reload index.html."
