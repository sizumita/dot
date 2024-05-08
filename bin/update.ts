import {Logger} from "../src/logger";

const logger = new Logger("self update", {
    use_nu: true,
    error: {
        show_error: true,
        exit: true
    }
})

logger.info("Updating homebrew")
await logger.complete("brew update")

logger.info("Pulling dot")
await logger.complete("git -C ~/dot pull")

logger.info("Satisfy Brewfile")
await logger.complete("brew bundle --file ($env.DOT_PATH | path join Brewfile)")

logger.info("Upgrade libraries")
await logger.complete("brew upgrade")

logger.info("Update Brewfile")
await logger.complete("brew bundle dump -f --file ($env.DOT_PATH | path join Brewfile)")
// update lock
await logger.complete("brew bundle --file ($env.DOT_PATH | path join Brewfile)")

logger.info("Cleanup")
await logger.complete("brew cleanup")
await import("./check.ts")
logger.info("`self sync`コマンドを実行し変更を保存してください。")
