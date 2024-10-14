function autopath() {
  local new_path=""
  # PATHからnode_modules/.binで終わるパスを除外
  local IFS=':'
  local -a path_array
  path_array=("${(@s/:/)PATH}")
  for path_item in "${path_array[@]}"; do
    if [[ "$path_item" != */node_modules/.bin ]]; then
      new_path="${new_path:+$new_path:}$path_item"
    fi
  done
  local node_modules_bin="$PWD/node_modules/.bin"
  if [[ -d "$node_modules_bin" ]]; then
    if [[ ":$new_path:" != *":$node_modules_bin:"* ]]; then
      new_path="${node_modules_bin}:${new_path}"
    fi
  fi
  export PATH="$new_path"
}

zsh-defer add-zsh-hook chpwd autopath
