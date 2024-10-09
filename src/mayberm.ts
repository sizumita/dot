import {unlink} from "node:fs/promises";

export const maybeRm = async (path: string) => {
    if (await Bun.file(path).exists()) {
        await unlink(path)
    }
}
