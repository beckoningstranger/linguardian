#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <API_URL>"
  exit 1
fi
API_URL=$1

echo "Querying $API_URL for data..."

allSupportedLanguages=$(curl -s "$API_URL/settings/supportedLanguages")
allLanguageFeatures=$(curl -s "$API_URL/settings/allLanguageFeatures")
allLearningModes=$(curl -s "$API_URL/settings/learningModes")
allUsernameSlugs=$(curl -s "$API_URL/users/getAllUsernameSlugs")
nextListNumber=$(curl -s "$API_URL/lists/nextListNumber")

output_file="./client/dataForBuild.ts"
{
  echo "export const allSupportedLanguages = $allSupportedLanguages;"
  echo "export const allLanguageFeatures = $allLanguageFeatures;"
  echo "export const allLearningModes = $allLearningModes;"
  echo "export const allUsernameSlugs = $allUsernameSlugs;"
  echo "export const nextListNumber = $nextListNumber;"
} > "$output_file"