import {unlink} from "node:fs/promises";
import logging from "./logging.ts";

export const maybeRm = async (path: string) => {
    if (await Bun.file(path).exists()) {
        logging.removing(`file or directory ${path}`)
        await unlink(path)
    }
}
