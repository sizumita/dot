use ($nu.default-config-dir | path join '../.cache/starship_init.nu')
use self/
use util.nu *

$env.NVM_DIR = ($env.DOT_PATH | path join .cache nvm)
