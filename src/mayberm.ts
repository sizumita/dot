import {unlink, stat} from "node:fs/promises";
import logging from "./logging.ts";

export const maybeRm = async (path: string) => {
    console.log(path)
    try {
        const stats = await stat(path)
        if (stats.isDirectory()) {
            logging.removing(`directory ${path}`)
            await unlink(path)
        } else {
            logging.removing(`file ${path}`)
            await unlink(path)
        }
    } catch (e) {
        logging.warning(`${path} does not exists, skipping`)
    }
}
