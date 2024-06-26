import { $ } from "bun";
import {Logger} from "../src/logger";
import {nu} from "../src/nu.ts";
import { unlink } from "node:fs/promises";

const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())
const home = process.env.HOME as string
const logger = new Logger("setup", {
    use_nu: true,
    error: {
        show_error: true,
        exit: true
    },
    complete: {
        quiet: !process.env.CI
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
    envPlist
)

logger.debug("Loading xdg config LaunchAgent")
await logger.complete(`launchctl unload -w ${home}/Library/LaunchAgents/xdg.config.plist`)
await logger.complete(`launchctl load -w ${home}/Library/LaunchAgents/xdg.config.plist`)

// Setup zsh
logger.info("Setup zsh")

await logger.complete(`ln -f -s -n ${dotPath}/static/zsh/.zshenv ${home}/.zshenv`)
await logger.complete(`ln -f -s -n ${dotPath}/static/zsh/.zsh.d ${home}/.zsh.d`)

// Install homebrew casks

logger.info("Setup homebrew")
await logger.complete("brew update")
if (!process.env.CI) {
    await logger.complete(`brew bundle --file ${dotPath}/Brewfile`)
} else {
    logger.info("CI is set, skipping...")
}

// Setup Config
logger.info("Setup .config")
await logger.complete(`ln -f -s -n ${dotPath}/.config ${home}/.config`)

// Setup .gitconfig
logger.info("Setup .gitconfig")
const type = await nu(`ls ${home}/.gitconfig | get type | get 0`, true).quiet()
if (type.exitCode === 0) {
    // File found, deleting
    if (type.text().startsWith("file")) {
        await unlink(`${home}/.gitconfig`)
        await logger.complete(`ln -f -s -n ${dotPath}/static/.gitconfig ${home}/.gitconfig`)
    }
} else {
    await logger.complete(`ln -f -s -n ${dotPath}/static/.gitconfig ${home}/.gitconfig`)
}


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
    <string>/bin/ln -sfn $HOME/Library/Group\\ Containers/2BUA8C4S2C.com.1password/t/agent.sock \\$SSH_AUTH_SOCK</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
`
await Bun.write(
    `${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`,
    sock
)
logger.debug("Load 1Password Sock")
await logger.complete(`launchctl unload -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`)
await logger.complete(`launchctl load -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`)

logger.debug("Installing rust")
if (Bun.which("cargo") === null) {
    await logger.complete("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --no-modify-path -y")
} else {
    if (!process.env.CI) {
        logger.info("Rust is installed. updating...")
        await logger.complete("rustup self update")
    }
}

logger.info("Add ssh config")
await logger.complete(`mkdir ${home}/.ssh`)
const sshConfigType = await nu(`ls ${home}/.ssh/config | get type | get 0`, true).quiet()
if (sshConfigType.exitCode === 0) {
    // File found, deleting
    if (sshConfigType.text().startsWith("file")) {
        await unlink(`${home}/.ssh/config`)
        await logger.complete(`ln -f -s -n ${dotPath}/static/.ssh/config ${home}/.ssh/config`)
    }
} else {
    await logger.complete(`ln -f -s -n ${dotPath}/static/.ssh/config ${home}/.ssh/config`)
}

logger.info("Change repository remote url")
await logger.complete(`git -C ${dotPath} remote set-url origin git@github.com:sizumita/dot.git`)

logger.info("Please restart this computer.")
