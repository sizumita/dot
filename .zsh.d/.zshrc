cache_dir="$HOME/dot/.cache"
sheldon_cache="$cache_dir/sheldon.zsh"
sheldon_toml="$HOME/.config/sheldon/plugins.toml"

if [[ ! -r "$sheldon_cache" ]]; then
  sheldon source > $sheldon_cache
fi

function source {
  # ensure_zcompiled $1
  builtin source $1
}

# function ensure_zcompiled {
#   local compiled="$1.zwc"
#   if [[ ! -r "$compiled" || "$1" -nt "$compiled" ]]; then
#     echo "Compiling $1"
#     zcompile $1
#   fi
# }
#ensure_zcompiled "$HOME/.zsh.d/.zshrc"

source "$sheldon_cache"
unfunction source
