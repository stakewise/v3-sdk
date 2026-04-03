#!/bin/bash
set -euo pipefail

DOCS_DOMAIN="https://docs.stakewise.io"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

SLUGS=$(grep -r "^slug:" src --include="*.md" 2>/dev/null \
  | sed -E 's/.*slug: *//' \
  | sed -E 's/ *$//' \
  | tr '[:upper:]' '[:lower:]' \
  | sort -u)

URLS=$(grep -roh "https://docs\.stakewise\.io/[^\"' )\`>]*" src \
  --include="*.ts" --include="*.tsx" \
  2>/dev/null \
  | sed -E 's/\\n$//' \
  | sed -E 's/[.,;)]+$//' \
  | sort -u)

ERRORS=0
SDK_URLS=""
OTHER_URLS=""

for url in $URLS; do
  path="${url#$DOCS_DOMAIN}"

  if [ -z "$path" ] || [ "$path" = "/" ]; then
    continue
  fi

  if echo "$path" | grep -q "^/sdk/api/"; then
    SDK_URLS="$SDK_URLS $url"
  else
    OTHER_URLS="$OTHER_URLS $url"
  fi
done

for url in $SDK_URLS; do
  path="${url#$DOCS_DOMAIN}"
  path_lower=$(echo "$path" | tr '[:upper:]' '[:lower:]')

  if ! echo "$SLUGS" | grep -qx "$path_lower"; then
    printf '%b\n' "  ${RED}BROKEN${NC}  $url"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ -n "$OTHER_URLS" ]; then
  SITEMAP=$(curl -s "$DOCS_DOMAIN/sitemap.xml" \
    | grep -oE "<loc>[^<]+" \
    | sed 's/<loc>//' \
    | sed 's|/$||' \
    | tr '[:upper:]' '[:lower:]')

  for url in $OTHER_URLS; do
    url_lower=$(echo "$url" | sed 's|/$||' | tr '[:upper:]' '[:lower:]')

    if ! echo "$SITEMAP" | grep -qx "$url_lower"; then
      printf '%b\n' "  ${RED}BROKEN${NC}  $url"
      ERRORS=$((ERRORS + 1))
    fi
  done
fi

if [ "$ERRORS" -gt 0 ]; then
  printf '%b\n' "\n${RED}Found $ERRORS broken link(s)!${NC}"
  exit 1
fi

printf '%b\n' "${GREEN}All docs links are valid.${NC}"
