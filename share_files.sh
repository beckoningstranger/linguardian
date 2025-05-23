#!/bin/bash

# rm -f ./client/lib/{types.ts,validations.ts,siteSettings.ts}
# cp ./server/src/lib/{types.ts,validations.ts,siteSettings.ts} ./client/lib/
# chmod 444 ./client/lib/{types.ts,validations.ts,siteSettings.ts}


set -e

# Paths
SERVER_LIB="./server/src/lib"
CLIENT_LIB="./client/lib"

# Clean old frontend files (ts + js for siteSettings)
rm -f "$CLIENT_LIB"/{types,validations,siteSettings}.{ts,js}

# Copy types.ts and validations.ts as-is (frontend TS compiles these)
cp "$SERVER_LIB"/{types.ts,validations.ts} "$CLIENT_LIB/"

# Compile siteSettings.ts from server to siteSettings.js for frontend runtime
cd server
npx tsc "./src/lib/siteSettings.ts" \
  --module NodeNext \
  --isolatedModules \
  --moduleResolution NodeNext \
  --target ESNext \
  --esModuleInterop true \
  --outDir "../$CLIENT_LIB/"
cd ..

# Optional: also copy the original siteSettings.ts if you want typings (can omit)
cp "$SERVER_LIB/siteSettings.ts" "$CLIENT_LIB/"

# Set read-only permissions on frontend lib files
chmod 444 "$CLIENT_LIB"/{types,validations,siteSettings}.{ts,js}

echo "Library files prepared for frontend build."