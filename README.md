# Introduction

<p align="center">
    <img src="https://i.ibb.co/yF2WrSt/Designer-6.png" alt="Siphar's Logo" width="256"/>
</p>

This repo holds a bear named **Siphar** which has some scripts for immediately setting up an express project based on this [template](https://github.com/Shivansh-Khunger/template_express_pino).

**Siphar** follows the saying -

> If you can't buy something you want, build it.

# Usage

If you want an Express project set up for you in a matter of seconds, copy and paste the following command into your terminal:

```bash
curl -sL https://github.com/Shivansh-Khunger/scripts_template_express_pino/blob/main/with_args.py | python - --dir 'name of the directory'
```

### Options

- `--biome`: Use biome.js as linter & formatter. If you haven't heard of it, visit [biomejs.dev](https://biomejs.dev/). This is set to **false** by default.
- `--git`: Initialize a git repo in the new project. This is set to **true** by default.
- `--dir`: Specify a name for the new project directory. The default is 'template_express_pino'.
- `--alias`: Add alias **'mkexp'** to run this script from any location in your command line interface. This is set to **true** by default.
- `--shell`: Specify the shell (bash [Default], zsh, ksh [Korn], csh [C-Shell], or fish).

  - Only needed if multiple shell configuration files are present.
  - If no shell is specified, the script will use the bash configuration file by default.
  - However, if other shell configuration files are found, it will follow the order:
    1. [zsh (oh my zsh)](https://ohmyz.sh/)
    2. [ksh (Korn-Shell)](http://kornshell.com/)
    3. [csh (C-Shell)](https://codedocs.org/what-is/c-shell)
    4. [fish (Fish-Shell)](https://fishshell.com/)
  - For example, if configuration files for both 'zsh' and 'ksh' are found, 'zsh' will be preferred.

  ### Accepted Inputs for `--shell` Argument

  The `--shell` argument accepts the following inputs:

  - Bash: You can specify this shell using any of the following inputs: `BASH`, `Bash`, `bash`.
  - Zsh: You can specify this shell using any of the following inputs: `ZSH`, `Zsh`, `zsh`.
  - Ksh (Korn-Shell): You can specify this shell using any of the following inputs: `KSH`, `KORN`, `Korn`, `korn`, `ksh`.
  - Csh (C-Shell): You can specify this shell using any of the following inputs: `CSH`, `C`, `c`, `csh`.
  - Fish: You can specify this shell using any of the following inputs: `FSH`, `FISH`, `Fish`, `fish`, `fsh`.

  Please note that the input is case-insensitive.

Here's an example of how to use these options:

```bash
curl -sL https://github.com/Shivansh-Khunger/scripts_template_express_pino/blob/main/with_args.py | python - --dir 'my_project' --biome --git --shell zsh
```

> **Note:** The command above will initialize biome as linter & formatter, but it will not initialize a git repository. This command will add the alias to the default config of [**oh-my-zsh**](https://ohmyz.sh/).

# Additional Usage

After the initial use of this script, you can simply type `mkexp` in your command line interface to invoke a sister script. This script will interactively take input from you to set up your project. This makes it even easier to quickly set up new Express projects based on the template.

> **Note for Unix-based system users:** The `mkexp` alias will only work if you invoke Python by typing `python` and not `python3`. Please ensure you have the correct Python alias set up in your system.

# Contributing

> **Note:** A detailed contributing guide will be added soon. Until then, if you want to make changes to this repository, please use your skills and common sense.

> **TIP:** Feel free to raise an issue or submit a pull request.
