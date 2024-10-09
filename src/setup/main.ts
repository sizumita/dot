import { $ } from "bun";
import {setup_1password_sock, setup_xdg_config} from "./launchctl.ts";
import {setup_symlink} from "./symlink.ts";
import {setup_cargo_binaries, setup_rust} from "./cargo.ts";

const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())


await setup_rust()
await setup_cargo_binaries()
await setup_1password_sock()
await setup_xdg_config()
await setup_symlink()


// Change repository remote url
await $`git -C ${dotPath} remote set-url origin git@github.com:sizumita/dot.git`
