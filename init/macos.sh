#!/usr/bin/env bash

xcode-select --install
export DOTPATH=${PREFIX:-"$HOME/dot"}

# install homebrew
command -v brew >/dev/null 2>&1 || {
  sudo -v
  curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash
  eval "$(/opt/homebrew/bin/brew shellenv)";
}
brew update

# install git

command -v git >/dev/null 2>&1 || {
  brew install git
}

# clone self

if [ -d "$DOTPATH" ]; then
  cd "$DOTPATH" || exit 1
  git status >/dev/null 2>&1 || exit 1
  git pull
else
  git clone --recursive https://github.com/sizumita/dot.git "$DOTPATH"
  cd "$DOTPATH" || exit 1
fi

# install from init Brewfile

brew bundle --file="init/Brewfile"

# run script

echo "Successfully installed environments, now let to run setup script"

bun install
bun run bin/setup.ts
