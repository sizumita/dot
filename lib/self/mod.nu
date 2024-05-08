use std log
export use bundle.nu

# 現在の環境に問題があるかどうかをチェックします。
export def check [] {
    bun run ($env.DOT_PATH | path join "bin/check.ts")
}

# dotの設定に現在の環境を合わせます。現在の環境の差分は消去されます。
export def pull [] {
    bun run ($env.DOT_PATH | path join "bin/pull.ts")
}

# 現在の環境でdotを上書きします。
export def push [] {
    bun run ($env.DOT_PATH | path join "bin/push.ts")
}

export alias update = push


export def main [] {
    let i = [check pull push] | input list --index "何をしますか？"
    match $i {
        0 => check
        1 => pull
        2 => push
    }
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
