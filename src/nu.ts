import {$} from "bun"

export const nu = (cmd: string, nothrow = true) => {
    if (nothrow) {

    }
    return nothrow ? $.nothrow()`nu -c "${cmd}"` : $`nu -c "${cmd}"`
}
