#!/bin/bash

rm ./client/lib/types.ts -f
rm ./client/lib/validations.ts -f
cp ./server/src/lib/types.ts ./client/lib/
cp ./server/src/lib/validations.ts ./client/lib/
chmod 444 ./client/lib/validations.ts
chmod 444 ./client/lib/types.ts