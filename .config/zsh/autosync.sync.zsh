if [[ ! -o login ]]; then
    bun run "${HOME}/dot/src/autosync/main.ts"
fi
