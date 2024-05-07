import {Logger} from "../src/logger";
import {nu} from "../src/nu.ts";
// dumpしていないものがないかチェック
// dumpしたものでアップデートするものがあるかチェック

const logger = new Logger("self check", {
    use_nu: true,
    error: {
        show_error: true
    },
    complete: {
        quiet: true
    }
})

logger.info("Checking homebrew bundle file...")
await logger.complete(
    `brew bundle check --file $"($env.DOT_PATH | path join "Brewfile")"`,
    {
        exit: true,
        errorMessage: "brew bundle can't satisfy Brewfile's dependencies. Please run `self bundle install`"
    }
)

logger.info("Checking not listed dependency in Brewfile...")

const resp = await nu("brew bundle cleanup --file $\"($env.DOT_PATH | path join \"Brewfile\")\"")
if (resp.text().includes("Would uninstall formulae:")) {
    logger.error("Brewfileに記載されていないライブラリが存在します。`self update`を実行してください。")
}
