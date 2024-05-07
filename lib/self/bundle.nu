export def install [] {
    brew bundle --file ($env.DOT_PATH | path join "Brewfile")
}

export def cleanup [--force (-f)] {
    if ($force) {
        brew bundle cleanup --force --file ($env.DOT_PATH | path join "Brewfile")
    } else {
        brew bundle cleanup --file ($env.DOT_PATH | path join "Brewfile")
    }
}

export def main [] {
    brew bundle --file ($env.DOT_PATH | path join Brewfile)
}
