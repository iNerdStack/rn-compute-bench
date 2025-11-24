#!/bin/bash

# Script to build and release Android APK
# This will clean, build a release APK, and copy it to the releases folder

set -e  # Exit on error

echo "Cleaning previous builds..."
cd android && ./gradlew clean && cd ..

echo "Building release APK..."
cd android && ./gradlew assembleRelease && cd ..

echo "Copying APK to releases folder..."
# Create releases directory if it doesn't exist
mkdir -p ../releases/android

# Copy the release APK to releases folder
cp android/app/build/outputs/apk/release/app-release.apk ../releases/android/rn-compute-bench.apk

echo "Release APK created successfully!"
echo "Location: releases/android/rn-compute-bench.apk"