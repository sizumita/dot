import { $ } from "bun";

async function setupNuShell() {
    const starship = await $`starship init nu`.text()

}
