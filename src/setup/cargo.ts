import {$} from "bun";
const home = process.env.HOME as string

export const setup_rust = async () => {
    await $`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --no-modify-path -y`
}

export const setup_cargo_binaries = async () => {
    await $`${home}/.cargo/bin/cargo +stable install cargo-update eza sheldon starship bat --locked --force`
}
