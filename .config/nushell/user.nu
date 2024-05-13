use ($nu.default-config-dir | path join '../../.cache/starship_init.nu')
use self/
use util.nu *

$env.HOMEBREW_BUNDLE_FILE_GLOBAL = ($env.DOT_PATH | path join "Brewfile")


# Add or remove node_modules bin path
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|before, after|
                ($before | describe) == "string" and (try {$after | path relative-to $before | false} catch {true}) and ($before | path join node_modules .bin | path exists)
            }
            code: {|before, after| load-env { PATH: ($env.PATH | split row (char esep) | filter {|x| $x != ($before | path join node_modules .bin)}) } }
        }
        {
            condition: {|_, after|
                ($after | path join node_modules .bin | path exists)
            }
            code: {|before, after| load-env { PATH: ($env.PATH | split row (char esep) | append ($after | path join node_modules .bin) | uniq) } }
        }
    ]
})
