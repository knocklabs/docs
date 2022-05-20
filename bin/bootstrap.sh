#!/usr/bin/env bash
set -o errexit

if ! command -v asdf &> /dev/null
then
  echo "Installing asdf"
  brew install asdf

  # After a fresh asdf install, we need to add the asdf executable to our shell's
  # run commands file. This will ensure asdf-installed executables are added to
  # our $PATH. We handle this step for bash and zsh.
  if [ "$SHELL" = "/bin/zsh" ]; then
    echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ~/.zshrc
  elif [ "$SHELL" = "/bin/bash" ]; then
    echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ~/.bash_profile
  else
    echo ""
    echo "Unknown shell!"
    echo "You must manually add the asdf executable to your shell's run-commands file before proceeding."
    echo "See the asdf docs for more info: http://asdf-vm.com/guide/getting-started.html#_3-install-asdf"

    exit 1
  fi
fi

asdf plugin add nodejs || true
asdf plugin add yarn || true

echo "Installing dependencies"

asdf install
yarn install

echo "🚀 Docs dependencies are ready to go!"
echo "Now, start the development server with \`yarn run dev\`"
