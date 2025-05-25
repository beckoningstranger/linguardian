#!/bin/bash
set -e

# Paths
SERVER_LIB="./server/src/lib"
CLIENT_LIB="./client/lib"

rm -f "$CLIENT_LIB"/{types,validations,siteSettings}.ts
cp "$SERVER_LIB"/{types,validations,siteSettings}.ts "$CLIENT_LIB/"
chmod 444 "$CLIENT_LIB"/{types,validations,siteSettings}.ts

echo "Library files shared successfully."