#!/bin/bash

rm ./client/types.ts -f
cp ./server/src/types.ts ./client
chmod 444 ./client/types.ts