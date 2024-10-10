import {$} from "bun";

const home = process.env.HOME as string

export const setup_xdg_config = async () => {
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
    await Bun.write(
        `${home}/Library/LaunchAgents/xdg.config.plist`,
        envPlist
    )

    await $`launchctl unload -w ${home}/Library/LaunchAgents/xdg.config.plist`
    await $`launchctl load -w ${home}/Library/LaunchAgents/xdg.config.plist`
}

export const setup_1password_sock = async () => {
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
    await $`launchctl unload -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`
    await $`launchctl load -w ${home}/Library/LaunchAgents/com.1password.SSH_AUTH_SOCK.plist`
}
