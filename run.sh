#!/usr/bin/env bash
# Usage : ./run.sh <numero_section>   (ex. ./run.sh 2)
# Recharge le jeu de données (section 1) puis exécute la section demandée,
# pour que chaque section parte des mêmes données.
set -euo pipefail

CONTAINER="${MONGO_CONTAINER:-efrei-mongo}"
URI="${MONGO_URI:-mongodb://efrei:efrei@localhost:27017/bibliotheque?authSource=admin}"
DIR="$(cd "$(dirname "$0")" && pwd)/scripts"

section=$(printf "%02d" "${1:?numéro de section requis}")
file=$(ls "$DIR"/"$section"_*.js)

run() {
  docker cp "$1" "$CONTAINER":/tmp/script.js > /dev/null
  docker exec "$CONTAINER" mongosh --quiet "$URI" --file /tmp/script.js
}

if [ "$section" != "01" ]; then
  run "$DIR"/01_*.js > /dev/null
fi
run "$file"
