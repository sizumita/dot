import {$} from "bun";
const home = process.env.HOME as string

export const setup_brew = async () => {
    await $`brew bundle --file="${home}/dot/init/Setup.Brewfile"`
}
