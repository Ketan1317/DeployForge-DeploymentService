#!/bin/bash

echo "Cloning repository..."
# GIT_REPO_URL in your script is an environment variable
git clone "$GIT_REPO_URL" /home/app/output

echo "Repository cloned successfully"

node script.js