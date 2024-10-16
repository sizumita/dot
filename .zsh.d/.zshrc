cache_dir="$HOME/dot/.cache"
sheldon_cache="$cache_dir/sheldon.zsh"
sheldon_toml="$HOME/.config/sheldon/plugins.toml"

if [[ ! -r "$sheldon_cache" ]]; then
  sheldon source > $sheldon_cache
fi

source "$sheldon_cache"
