#!/bin/bash

version=${1:-"latest"}
versionlocator=$([ "$version" == "latest" ] && echo "" || echo "tags/" )
echo "Installing EdgeRouter Dashboard $versionlocator$version"

rm -rf /var/www/htdocs/dashboard/*

curl -s https://api.github.com/repos/dan-escott/edgerouter-dashboard/releases/$versionlocator$version \
  | grep -m 1 "browser_download_url.*edgerouter-dashboard.*tar.gz" \
  | cut -d : -f 2,3 \
  | curl -s -L0 $(tr -d \") \
  | tar -zxv -C /var/www/htdocs/dashboard
