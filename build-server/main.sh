#!/bin/sh
set -eu

echo "Cloning repository..."
git clone --depth 1 "$GIT_REPO_URL" /home/app/output

echo "Repository cloned successfully"

node /home/app/dist/script.js
