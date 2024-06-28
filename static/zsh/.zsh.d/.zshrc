if [ -n "$INTELLIJ_ENVIRONMENT_READER" ]; then
else
    if [[ -o login ]]; then
        export SHELL="nu"
        exec /opt/homebrew/bin/nu -l -i
    fi
fi
