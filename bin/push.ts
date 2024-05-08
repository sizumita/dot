import {Logger} from "../src/logger";

const logger = new Logger("self push", {
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
await logger.info("Update Brewfile")
await logger.complete("brew bundle dump -f --file ($env.DOT_PATH | path join Brewfile)")
await logger.info("Cleanup")
await logger.complete("brew cleanup")
await import("./check.ts")
