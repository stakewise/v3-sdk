#!/bin/bash
# Prevents force-pushing to production

echo ">> Checking branch name"

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
PROTECTED_BRANCHES="^(main)"

if [[ "$CURRENT_BRANCH" =~ $PROTECTED_BRANCHES ]]
then
  echo "🚫 Cannot push to remote $CURRENT_BRANCH branch, please create your own branch and use PR." && exit 1
fi

echo ">> Finish checking branch name"

exit 0
