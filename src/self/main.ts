import {program} from "commander";
import {$} from "bun";
import logging from "../logging.ts";

program
    .name("self")
    .description("sizumita's dotfile self updater")
    .version("1.0.0")

program.command("update")
    .action(async () => {
        logging.updating("homebrew")
        await $`brew update && brew upgrade`
        logging.updating("cargo install")
        await $`cargo install-update -a`
    })

program.parse()
