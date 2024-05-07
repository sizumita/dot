use ($nu.default-config-dir | path join '../../.cache/starship_init.nu')
use self/
use util.nu *

$env.HOMEBREW_BUNDLE_FILE_GLOBAL = ($env.DOT_PATH | path join "Brewfile")
