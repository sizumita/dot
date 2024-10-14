import {maybeRm} from "../mayberm.ts";
import {mkdir, symlink} from "node:fs/promises";
import {$} from "bun";

const home = process.env.HOME as string
const dotPath = await $`echo "$HOME/dot"`.text().then(x => x.trim())

export const setup_symlink = async () => {
    // Setup zsh
    await maybeRm(`${home}/.zshenv`)
    await maybeRm(`${home}/.zsh.d`)
    await symlink(`${dotPath}/.zshenv`, `${home}/.zshenv`)
    await symlink(`${dotPath}/.zsh.d`, `${home}/.zsh.d`)

    // Setup Config
    await maybeRm(`${home}/.config`)
    await symlink( `${dotPath}/.config`, `${home}/.config`)

    // Setup .gitconfig
    await maybeRm(`${home}/.gitconfig`)
    await symlink(`${dotPath}/static/.gitconfig`, `${home}/.gitconfig`)

    // ssh config
    await mkdir(`${home}/.ssh`, {recursive: true})
    await maybeRm(`${home}/.ssh/config`)
    await maybeRm(`${home}/.ssh/allowed_signers`)
    await symlink(`${dotPath}/static/.ssh/config`, `${home}/.ssh/config`)
    await symlink(`${dotPath}/static/.ssh/allowed_signers`, `${home}/.ssh/allowed_signers`)

    // local
    await maybeRm(`${home}/local`)
    await symlink(`${dotPath}/local`, `${home}/local`)
}
