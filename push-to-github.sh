#!/bin/bash

echo "=========================================="
echo "Push to GitHub using Personal Access Token"
echo "=========================================="
echo ""
echo "Make sure you have created a PAT at:"
echo "https://github.com/settings/tokens"
echo ""
echo "When you run 'git push -u origin main', you will be prompted:"
echo "  Username: infocravorasolutions-code"
echo "  Password: [paste your PAT token here]"
echo ""
echo "Ready to push? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
else
    echo "Push cancelled."
fi

