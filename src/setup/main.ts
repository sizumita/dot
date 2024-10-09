import { $ } from "bun";
import {setup_1password_sock, setup_xdg_config} from "./launchctl.ts";
import {setup_symlink} from "./symlink.ts";
import {setup_cargo_binaries, setup_rust} from "./cargo.ts";

const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())


console.log("   Setup rust")
await setup_rust()
console.log("   Setup symlink")
await setup_cargo_binaries()
console.log("   Setup 1password sock")
await setup_1password_sock()
console.log("   Setup xdg config")
await setup_xdg_config()
console.log("   Setup symlink")
await setup_symlink()


// Change repository remote url
console.log("   Change remote url")
await $`git -C ${dotPath} remote set-url origin git@github.com:sizumita/dot.git`
