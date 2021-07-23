#!/usr/bin/env bash
set -o errexit

if ! command -v asdf &> /dev/null
then
  echo "Installing asdf"

  brew install asdf
fi

asdf plugin add nodejs || true
asdf plugin add yarn || true

echo "Installing dependencies"

asdf install
yarn install

echo "🚀 Docs dependencies are ready to go!"
echo "Now, start the development server with `yarn run dev`"