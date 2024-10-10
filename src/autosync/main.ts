import logging from "../logging.ts";
import {$} from "bun";

logging.checking("dotfile directory")

const isDirty = await $`git status -s`.text().then(x => x.length !== 0)
