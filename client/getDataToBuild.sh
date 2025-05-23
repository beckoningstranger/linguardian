#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <API_URL>"
  exit 1
fi
API_URL=$1

echo "Querying $API_URL for data..."

allUsernameSlugs=$(curl -s "$API_URL/users/getAllUsernameSlugs")
nextListNumber=$(curl -s "$API_URL/lists/nextListNumber")

output_file="./client/dataForBuild.ts"
{
  echo "export const allUsernameSlugs = $allUsernameSlugs;"
  echo "export const nextListNumber = $nextListNumber;"
} > "$output_file"