function starship_cache {
    local cache_dir="$HOME/dot/.cache"
    local cache_file="$cache_dir/starship.zsh"
    if ! diff -q "$cache_file" <(starship init zsh) > /dev/null; then
        echo "$(starship init zsh)" > "$cache_file"
    fi
}

function init_starship {
    local cache_dir="$HOME/dot/.cache"
    local cache_file="$cache_dir/starship.zsh"
    if [[ ! -r "$cache_file" ]]; then
        echo "$(starship init zsh)" > "$cache_file"
    else
        zsh-defer starship_cache
    fi
    source "$cache_file"
}

init_starship
