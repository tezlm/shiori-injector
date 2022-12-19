#!/usr/bin/env bash

# Update dependencies
pnpm install

# Run rollup build
pnpm run build

# Lint extension, while excluding dev files
pnpx web-ext lint --ignore-files .idea dist docs src web-ext-artifacts scss .gitignore *.sh *.ps1 *.iml *.js *.lock
# Build extension, while excluding dev files
pnpx web-ext build --overwrite-dest --ignore-files .idea dist docs src web-ext-artifacts scss .gitignore *.sh *.ps1 *.iml *.js *.lock

echo "✅ Done"
