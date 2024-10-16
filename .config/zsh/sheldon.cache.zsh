cache_dir="$HOME/dot/.cache"
sheldon_cache="$cache_dir/sheldon.zsh"
sheldon_toml="$HOME/.config/sheldon/plugins.toml"

if [[ ! -r "$sheldon_cache" ]]; then
  sheldon source > $sheldon_cache
else
    if ! diff -q "$sheldon_cache" "$sheldon_toml" > /dev/null; then
        sheldon source > $sheldon_cache
    fi
fi

unset cache_dir sheldon_cache sheldon_toml
