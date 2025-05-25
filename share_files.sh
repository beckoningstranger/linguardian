#!/bin/bash
set -e

# Paths
SERVER_LIB="./server/src/lib"
CLIENT_LIB="./client/lib"

# Clean old frontend files (ts + js for siteSettings)
rm -f "$CLIENT_LIB"/{types,validations,siteSettings}.{ts,js}

# Copy types.ts and validations.ts as-is (frontend TS compiles these)
cp "$SERVER_LIB"/{types.ts,validations.ts,siteSettings.ts} "$CLIENT_LIB/"

# Compile siteSettings.ts from server to siteSettings.js for frontend runtime
cd server
npx tsc "./src/lib/siteSettings.ts" \
  --module NodeNext \
  --isolatedModules \
  --moduleResolution NodeNext \
  --target ESNext \
  --esModuleInterop true \
  --outDir .
cd ..
cp server/siteSettings.js "$CLIENT_LIB/"
rm -f server/{siteSettings,validations,types}.js

# Set read-only permissions on frontend lib files
chmod 444 "$CLIENT_LIB"/{types,validations,siteSettings}.ts "$CLIENT_LIB"/siteSettings.js

echo "Library files prepared for frontend build."