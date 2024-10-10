import pico from "picocolors"

const log = (action: string, message: string) => {
    console.log(`${' '.repeat(12-action.length)}${action}`, message)
}

export default Object.assign(log, {
    setup: (msg: string) => log(pico.bold(pico.green("Setup")), msg),
    downloaded: (msg: string) => log(pico.bold(pico.green("Downloaded")), msg),
    updating: (msg: string) => log(pico.bold(pico.green("Updating")), msg),
})
