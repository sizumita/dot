import {setup_1password_sock, setup_xdg_config} from "./launchctl.ts";
import {setup_symlink} from "./symlink.ts";
import {setup_cargo_binaries, setup_rust} from "./cargo.ts";
import logging from "../logging.ts";
import {setup_brew} from "./brew.ts";

logging.setup("Rust")
await setup_rust()
logging.setup("Cargo Install")
await setup_cargo_binaries()
logging.setup("1password sock")
await setup_1password_sock()
logging.setup("xdg config")
await setup_xdg_config()
logging.setup("symlink")
await setup_symlink()
logging.setup("homebrew")
await setup_brew()
