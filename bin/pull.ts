import {Logger} from "../src/logger";

const logger = new Logger("self pull", {
    use_nu: true,
    error: {
        show_error: true
    }
})

logger.info("Pulling dot")
await logger.complete("git -C ~/dot pull")
logger.info("Satisfy Brewfile")
await logger.complete("brew bundle --file ($env.DOT_PATH | path join Brewfile)")

logger.info("Remove unlisted libs")
await logger.complete("brew bundle cleanup -f --file ($env.DOT_PATH | path join Brewfile)")

await logger.info("Cleanup")
await logger.complete("brew cleanup")
