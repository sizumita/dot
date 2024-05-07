import { $ } from "bun";
import {Logger} from "../src/logger";

const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())
const home = process.env.HOME as string
const logger = new Logger("setup", {
    use_nu: true,
    error: {
        show_error: true,
        exit: true
    },
    complete: {
        quiet: !!process.env.CI
    }
})

// Setup nushell
// NOTE: デフォルトシェルにするとJetbrains IDEがprintenvできずに死ぬので、zshから呼び出すようにする
logger.info("Setup NuShell")

// Init starship

const starshipConfig = await $`starship init nu`.text()

await Bun.write(`${dotPath}/.cache/starship_init.nu`, starshipConfig)

// Add launchd

const envPlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>xdg.config</string>
    <key>ProgramArguments</key>
    <array>
      <string>/bin/launchctl</string>
      <string>setenv</string>
      <string>XDG_CONFIG_HOME</string>
      <string>${home}/dot/.config</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
  </dict>
</plist>
`
logger.debug("Writing xdg config")
await Bun.write(
    `${home}/Library/LaunchAgents/xdg.config.plist`,
    envPlist,
    {
        createPath: false
    }
)

logger.debug("Loading xdg config LaunchAgent")
await logger.complete(`launchctl unload -w ${home}/Library/LaunchAgents/xdg.config.plist`)
await logger.complete(`launchctl load -w ${home}/Library/LaunchAgents/xdg.config.plist`)

// Setup zsh
logger.info("Setup zsh")

await logger.complete(`ln -f -s ${dotPath}/static/zsh/.zshenv ${home}/.zshenv`)
await logger.complete(`ln -f -s ${dotPath}/static/zsh/.zsh.d ${home}/.zsh.d`)

// Install homebrew casks

logger.info("Setup homebrew")
await logger.complete("brew update")
if (process.env.CI) {
    await logger.complete(`brew bundle --file ${dotPath}/Brewfile --brews --casks --taps --vscode`)
} else {
    await logger.complete(`brew bundle --file ${dotPath}/Brewfile`)
}

// Setup Config
logger.info("Setup .config")
await logger.complete(`ln -f -s ${dotPath}/.config ${home}/.config`)

// Create 1Password Sock
logger.info("Create 1Password Sock")

const sock = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.1password.SSH_AUTH_SOCK</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>-c</string>
    <string>/bin/ln -sf $HOME/Library/Group\\ Containers/2BUA8C4S2C.com.1password/t/agent.sock \\$SSH_AUTH_SOCK</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
`
await Bun.write(
    `${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`,
    sock,
    {
        createPath: false
    }
)
logger.debug("Load 1Password Sock")
await logger.complete(`launchctl unload -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`)
await logger.complete(`launchctl load -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`)

logger.debug("Installing rust")
if (Bun.which("cargo") === null) {
    await logger.complete("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --no-modify-path -y")
} else {
    logger.info("Rust is installed. updating...")
    await logger.complete("rustup self update")
}

logger.info("Please restart this computer.")
