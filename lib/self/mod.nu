use std log
export use bundle.nu

export def check [] {
    bun run ($env.DOT_PATH | path join "bin/check.ts")
}

export def update [] {
    bun run ($env.DOT_PATH | path join "bin/update.ts")
}

export def commit [] {
    bun run ($env.DOT_PATH | path join "bin/commit.ts")
}

export def main [] {
    check
}

export def remove [...name: string] {
    brew uninstall ...$name
    brew autoremove
}

export def add [...name: string] {
    brew install ...$name
}

export def list [] {
    brew list
}
