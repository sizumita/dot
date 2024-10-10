import pico from "picocolors"

const log = (action: string, message: string, formatter?: (value: string) => string) => {
    console.log(`${' '.repeat(12-action.length)}${formatter ? formatter(action) : action}`, message)
}

const formatters = {
    boldGreen: v => pico.bold(pico.green(v)),
    boldRed: v => pico.bold(pico.red(v)),
    boldYellow: v => pico.bold(pico.yellow(v)),
} satisfies {[p: string]: (v: string) => string}

export default Object.assign(log, {
    setup: (msg: string) => log("Setup", msg, formatters.boldGreen),
    downloaded: (msg: string) => log("Downloaded", msg, formatters.boldGreen),
    updating: (msg: string) => log("Updating", msg, formatters.boldGreen),
    removing: (msg: string) => log("Removing", msg, formatters.boldRed),
    checking: (msg: string) => log("Checking", msg, formatters.boldYellow),
})
