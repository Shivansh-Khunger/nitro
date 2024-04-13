#!/bin/bash

# Initialize USER_SHELL variable
USER_SHELL=""

# Function to output help message
output_help_message() {
    echo "Usage: update_profile.sh [-s shell] [-h]"
    echo ""
    echo "Options:"
    echo "-s shell      Specify the shell (bash [Default], zsh, ksh [Korn], csh [C-Shell], or fish)."
    echo "              Only needed if multiple shell configuration files are present."
    echo "-h | --help   Display this help message."
    echo ""
    echo "This script adds an alias to the specified shell's configuration file."
    echo "The alias is for a Python script located at \$HOME/bin_scripts/without_args.py."
    echo -e "If no shell is specified, the script will use the bash configuration file by default. \n\
    However, if other shell configuration files are found, it will follow the order: \n\
    1. zsh \n\
    2. ksh \n\
    3. csh \n\
    4. fish \n\
    For example, if configuration files for both 'zsh' and 'ksh' are found, zsh will be preferred."
}

# Parse command-line options
while getopts "s:h-:" OPTION; do
    # Use a case statement to handle each option
    case "${OPTION}" in
    s)
        # Handle the shell option (-s)
        # Use a nested case statement to handle each possible argument
        case "$OPTARG" in
        BASH | Bash | bash)
            # If the argument is bash, set USER_SHELL to bash
            USER_SHELL="bash"
            ;;
        ZSH | Zsh | zsh)
            # If the argument is zsh, set USER_SHELL to zsh
            USER_SHELL="zsh"
            ;;
        KSH | KORN | Korn | korn | ksh)
            # If the argument is ksh, set USER_SHELL to ksh
            USER_SHELL="ksh"
            ;;
        CSH | C | c | csh)
            # If the argument is csh, set USER_SHELL to csh
            USER_SHELL="csh"
            ;;
        FSH | FISH | Fish | fish | fsh)
            # If the argument is fish, set USER_SHELL to fish
            USER_SHELL="fish"
            ;;
        *)
            # If the argument is anything else, print an error message and exit
            echo "Invalid option. Please refer to the help (-h | --help) for more information."            
            exit 1
            ;;
        esac
        ;;
    h)
        # Handle the help option (-h)
        # Call the output_help_message function and exit
        output_help_message
        exit 0
        ;;
    -)
        # Handle long-form options (--option)
        # Use a nested case statement to handle each possible argument
        case "${OPTARG}" in
        help)
            # If the argument is help, call the output_help_message function and exit
            output_help_message
            exit 0
            ;;
        *)
            # If the argument is anything else, print an error message and exit
            echo "Invalid option: --$OPTARG"
            exit 1
            ;;
        esac
        ;;
    \?)
        # Handle invalid options
        # Print an error message and exit
        echo "Invalid option: -$OPTARG"
        exit 1
        ;;
    esac
done
# Default shell file is bash
SHELL_FILE=~/.bashrc
# Define alias command
ALIAS_COMMAND=("\nalias" "mkexp='python3 $HOME/bin_scripts/without_args.py")

# Define paths for other shell files
ZSH_FILE=~/.zshrc
KSH_FILE=~/.kshrc
CSH_FILE=~/.cshrc
FISH_FILE=~/.config/fish/config.fish

# Update SHELL_FILE if a specific shell was specified
case "${USER_SHELL}" in
zsh)
    SHELL_FILE=$ZSH_FILE
    ;;
ksh)
    SHELL_FILE=$KSH_FILE
    ;;
csh)
    SHELL_FILE=$CSH_FILE
    ;;
fsh)
    SHELL_FILE=$FISH_FILE
    ;;
*) ;;
esac

# If no specific shell was specified, use the first available shell file
if test -f $ZSH_FILE; then
    SHELL_FILE=$ZSH_FILE
fi

if test -f $KSH_FILE; then
    SHELL_FILE=$KSH_FILE
fi

if test -f $CSH_FILE; then
    SHELL_FILE=$CSH_FILE
fi

if test -f $FISH_FILE; then
    SHELL_FILE=$FISH_FILE
fi

# Update the shell file
echo updating $SHELL_FILE...

# Check if the alias is already present
if grep -Fxq "${ALIAS_COMMAND[@]}" $SHELL_FILE; then
    echo Alias already is present
else
    # If not, add the alias
    echo "${ALIAS_COMMAND[@]}" >> $SHELL_FILE
fi

# Source the shell file to make the new alias available
# shellcheck disable=SC1090
source $SHELL_FILE