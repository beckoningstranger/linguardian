#!/bin/bash
./share_types.sh
npm run build --prefix client && npm start --prefix server & npm start --prefix client