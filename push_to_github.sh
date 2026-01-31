#!/bin/bash

# --- UPDATE THESE BLANKS ---
GITHUB_USERNAME=""
REPO_NAME=""
# ---------------------------

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo "Error: Please open this script and fill in your GITHUB_USERNAME and REPO_NAME first!"
    exit 1
fi

echo "Linking to GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Add the remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Push to main
echo "Pushing code..."
git push -u origin main

echo "Done! Check your repository at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
