#!/bin/bash
set -e

# Paths
SERVER_LIB="./server/src/lib"
CLIENT_LIB="./client/lib"
SERVER_CONTRACTS="$SERVER_LIB/contracts"
CLIENT_CONTRACTS="$CLIENT_LIB/contracts"

# Shared library files
LIB_FILES=("siteSettings.ts" "regexRules.ts")

# Cleanup old files
for file in "${LIB_FILES[@]}"; do
  rm -f "$CLIENT_LIB/$file"
done
rm -rf "$CLIENT_CONTRACTS"
mkdir -p "$CLIENT_CONTRACTS"

# Copy library files
for file in "${LIB_FILES[@]}"; do
  cp "$SERVER_LIB/$file" "$CLIENT_LIB/"
done
cp "$SERVER_CONTRACTS"/*.ts "$CLIENT_CONTRACTS/"

# Set read-only permissions
for file in "${LIB_FILES[@]}"; do
  chmod 444 "$CLIENT_LIB/$file"
done
chmod 444 "$CLIENT_CONTRACTS"/*.ts

echo "Library files shared successfully."