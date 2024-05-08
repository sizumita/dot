import {Logger} from "../src/logger";
import {nu} from "../src/nu.ts";

const logger = new Logger("self sync", {
    use_nu: true,
    error: {
        show_error: true,
        exit: true
    }
})

logger.info("Pulling from remote...")

// await logger.complete("git -C ~/dot pull")
const changes = await nu("git -C ~/dot status --porcelain | into string").nothrow().quiet()
if (changes.exitCode !== 0) {
    await logger.error("Failed to get status:", changes.text())
    process.exit(-1)
}
if (changes.text() === "") {
    await logger.info("変更はありませんでした。")
    process.exit(0)
}
logger.info(`以下のファイルに変更がありました:`, changes.text().split("\n").join(", "))
await logger.complete("git -C ~/dot add .")
const nodeName = await nu("uname | get nodename").nothrow().quiet().text()
logger.info("変更を保存しpushします")
await logger.complete(`git -C ~/dot commit -m "[auto] Update changes from ${nodeName}"`)
// await logger.complete("git -C ~/dot push origin main")
logger.info("完了しました。")
