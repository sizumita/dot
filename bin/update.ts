import {Logger} from "../src/logger";
// dumpしていないものがないかチェック
// dumpしたものでアップデートするものがあるかチェック

const logger = new Logger("self update", {
    use_nu: true,
    error: {
        show_error: true
    }
})

logger.info("Updating homebrew")
await logger.complete("brew update")
logger.info("Pulling dot")
await logger.complete("git -C ~/dot pull")
logger.info("Satisfy Brewfile")
await logger.complete("brew bundle --file ($env.DOT_PATH | path join Brewfile)")
await logger.info("Upgrade libraries")
await logger.complete("brew upgrade")
await import("./check.ts")
