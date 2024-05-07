import {$} from "bun"
import {red, white, bold, yellow, gray, dim} from 'picocolors'
import {acc} from "../escape.ts";
import {nu} from "../nu.ts";

export type LoggerOption = {
    use_nu?: boolean
    error?: {
        show_error?: boolean
        exit?: boolean
    }
    complete?: {
        quiet?: boolean
    }
}

export class Logger {
    constructor(private name: string, private option?: LoggerOption) {
    }

    error(...messages: any[]) {
        const now = dim(white(new Date().toLocaleString("en-GB")))
        console.error(now, bold(red("ERROR")), `${bold(yellow(`[${this.name}]`))}:`, ...messages.map(x => bold(red(x))))
    }

    info(...messages: string[]) {
        const now = dim(white(new Date().toLocaleString("en-GB")))
        console.info(now, bold(white("INFO ")), `${bold(yellow(`[${this.name}]`))}:`, ...messages.map(x => white(x)))
    }

    debug(...messages: any[]) {
        const now = dim(white(new Date().toLocaleString("en-GB")))
        console.debug(now, bold(gray("DEBUG")), `${bold(yellow(`[${this.name}]`))}:`, ...messages.map(x => dim(white(x))))
    }

    async complete(cmd: string, opt?: {throw?: boolean, quiet?: boolean, errorMessage?: string, exit?: boolean}) {
        this.debug(">", acc(cmd))
        let p = this.option?.use_nu ? nu(`${cmd}`, !opt?.throw) : (
            !opt?.throw ? $.nothrow()`${cmd}` : $`${cmd}`
        )
        if (opt?.quiet || this.option?.complete?.quiet) {
            p = p.quiet()
        }
        const r = await p
        if (r.exitCode > 0) {
            if (this.option?.error?.show_error) {
                this.error(
                    opt?.errorMessage ?? `Failed to run command \`${cmd}\` with status ${r.exitCode}`
                )
                if (opt?.exit || this.option.error.exit) {
                    process.exit(1)
                }
            }
            return false
        }
        return true
    }
}
