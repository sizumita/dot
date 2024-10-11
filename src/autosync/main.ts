import logging from "../logging.ts";
import {$} from "bun";
import { confirm } from '@inquirer/prompts';

const home = process.env.HOME as string

logging.checking("dotfile directory")
await $`git -C ${home}/dot fetch`
const isDirty = await $`git -C ${home}/dot status -s`.quiet().text().then(x => x.length !== 0)
const hasRemoteNewCommit = await $`git -C ${home}/dot diff HEAD..origin/main --stat --exit-code`.nothrow().quiet().then(x => x.exitCode !== 0)
const hasLocalNewCommit = await $`git -C ${home}/dot diff HEAD..origin/main --stat --exit-code`.nothrow().quiet().then(x => x.exitCode !== 0)

if (isDirty) {
    if (hasRemoteNewCommit) {
        logging.warning("local has changes, but remote has new commit")
        const answer = await confirm({ message: 'Do you want to remove local changes?', default: true })
        if (answer) {
            logging.removing("dotfile local changes")
            await $`git -C ${home}/dot reset --hard`
            await $`git -C ${home}/dot pull`
        }
    } else if (await confirm({ message: 'Do you want to create auto commit?', default: true })) {
        logging.creating("new commit")
        const name = await $`uname -n`.quiet().text()
        await $`git -C ${home}/dot commit -m "[auto] creating new commit from ${name}"`
        logging.updating("remote repository")
        await $`git -C ${home}/dot push`
    }
} else if (hasLocalNewCommit) {
    logging.updating("remote repository")
    await $`git -C ${home}/dot push`
}
