import {maybeRm} from "../mayberm.ts";
import {mkdir, symlink} from "node:fs/promises";
import {$} from "bun";

const home = process.env.HOME as string
const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())

export const setup_symlink = async () => {
    // Setup zsh
    await maybeRm(`${home}/.zshenv`)
    await maybeRm(`${home}/.zsh.d`)
    await symlink(`${home}/.zshenv`, `${dotPath}/.zshenv`)
    await symlink(`${home}/.zsh.d`, `${dotPath}/.zsh.d`)

    // Setup Config
    await maybeRm(`${home}/.config`)
    await symlink(`${home}/.config`, `${dotPath}/.config`)

    // Setup .gitconfig
    await maybeRm(`${home}/.gitconfig`)
    await symlink(`${home}/.gitconfig`, `${dotPath}/static/.gitconfig`)


    // ssh config
    await mkdir(`${home}/.ssh`, {recursive: true})
    await maybeRm(`${home}/.ssh/config`)
    await symlink(`${home}/.ssh/config`, `${dotPath}/static/.ssh/config`)

}