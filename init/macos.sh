#!/usr/bin/env zsh

export DOTPATH=${PREFIX:-"$HOME/dot"}

# install homebrew

if ! (( $+commands[brew] )); then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "homebrew is available, update homebrew"
  brew update
fi

# install git

if ! (( $+commands[git] )); then
  brew install git
else
  echo "git is available"
fi

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

bun install
bun run bin/setup.ts
