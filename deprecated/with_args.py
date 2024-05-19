"""
This module provides utilities for interacting with the operating system.

It includes functionality for handling files and directories (os, pathlib, shutil),
running subprocesses (subprocess), parsing command-line arguments (argparse),
and downloading content from URLs (urllib.request). It also provides access to
JSON functionality (json), file and directory permissions (stat), and system-specific
parameters (platform).
"""
import os
import json
import stat
import subprocess
import argparse
import platform
import urllib.request
from pathlib import Path
from threading import Thread
from shutil import rmtree

# Constants
OS_NAME = platform.system()  # Get OS name
IF_WIN = (OS_NAME == 'Windows')  # Check if OS is Windows
USER_BIN_DIR = str(Path.home()) + '/bin_scripts'  # Path to bin_scripts

TEMPLATE_REPO_URL = "https://github.com/Shivansh-Khunger/template-express-nitro"  # Template URL
REPO_URL = "https://github.com/Shivansh-Khunger/express-nitro"  # Repository URL
RAW_REPO_URL = "https://raw.githubusercontent.com/Shivansh-Khunger/express-nitro/main"  # Raw repository URL


# Create the parser
parser = argparse.ArgumentParser(
    description='Create a new project based on the template-express-nitro repository.')

# Add the arguments
parser.add_argument('--biome', action='store_true',
                    help="Use biome.js as linter & formatter haven't heard of it visit https://biomejs.dev/")

parser.add_argument('--git', action='store_false',
                    help='Initialize a git repo in the new project')

parser.add_argument('--dir', type=str, default='template-express-nitro',
                    help='Name for the new project directory')

parser.add_argument('--alias',  action='store_false',
                    help="Add alias 'mkexp' to run this script from any location in your command line interface")

parser.add_argument('--shell', type=str, default='',
                    help='''Specify the shell (bash [Default], zsh, ksh [Korn], csh [C-Shell], or fish).
                    Only needed if multiple shell configuration files are present.
                    If no shell is specified, the script will use the bash configuration file by default.
                    However, if other shell configuration files are found, it will follow the order:
                    1. zsh (oh my zsh): https://ohmyz.sh/
                    2. ksh  (Korn-Shell): http://kornshell.com/
                    3. csh  (C-Shell): https://codedocs.org/what-is/c-shell
                    4. fish (Fish-Shell): https://fishshell.com/
                    For example, if configuration files for both 'zsh' and 'ksh' are found, 'zsh' will be preferred.''')

# Parse the arguments
args = parser.parse_args()

# Define new project directory and clone command
new_project_dir = os.getcwd() + f'/{args.dir}'

# Execute clone command and rename the cloned directory
subprocess.run(['git', 'clone', TEMPLATE_REPO_URL], shell=IF_WIN, check=True)
os.rename(os.getcwd() + '/template-express-nitro',
          new_project_dir)


# Define a function to install dependencies
def install_dependencies():
    """
    Installs npm dependencies in the current project directory.

    This function runs the command 'npm i' in a subprocess, which installs the npm dependencies.
    It uses the 'shell' argument set to IF_WIN (which should be a boolean indicating if the OS is Windows),
    and the 'cwd' argument set to new_project_dir (which should be the directory of the new project).
    If the subprocess call exits with a non-zero code, a CalledProcessError will be raised (because 'check' is True).
    """
    subprocess.run(['npm', 'i'], shell=IF_WIN, cwd=new_project_dir, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)


# Create a new thread with install_dependencies as the target function and start it
Thread(target=install_dependencies).start()


# Define function to remove biome
def remove_biome():
    """
    This function removes the 'biome.json' file and the '@biomejs/biome' dependency from the 'package.json' file.
    It also removes the first recommendation from the '.vscode/extensions.json' file in the new project directory.
    """
    biome_path = new_project_dir + '/biome.json'
    package_json_path = new_project_dir + '/package.json'
    vscode_extension_recommend_path = new_project_dir + '/.vscode/extensions.json'

    # Remove the 'biome.json' file
    os.remove(biome_path)

    # Open the 'package.json' file and load its JSON content
    with open(package_json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

        # Remove the '@biomejs/biome' dependency
        data['devDependencies'].pop('@biomejs/biome')

        # Write the updated JSON data back to the 'package.json' file
        with open(package_json_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

    # Open the '.vscode/extensions.json' file and load its JSON content
    with open(vscode_extension_recommend_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

        # Remove the recommendation for biome's extension
        data['recommendations'].pop(0)

        # Write the updated JSON data back to the '.vscode/extensions.json' file
        with open(vscode_extension_recommend_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)


# Define function to remove git
def remove_git():
    """
    This function removes the .git directory from a new project directory.

    It first walks through the .git directory, changing the permissions of each directory and file to
    ensure the user has read, write, and execute permissions.
    Then it removes the entire .git directory using the rmtree function from the shutil module.
    """
    # Define the path to the .git directory
    git_dir_path = new_project_dir + '/.git'

    # Walk through the .git directory
    for root, dirs, files in os.walk(git_dir_path):
        # For each directory in the .git directory
        for each_dir in dirs:
            # Change the permissions to ensure the user has read, write, and execute permissions
            os.chmod(os.path.join(root, each_dir), stat.S_IRWXU)
        # For each file in the .git directory
        for file in files:
            # Change the permissions here as well like before
            os.chmod(os.path.join(root, file), stat.S_IRWXU)

    # Remove the entire .git directory
    rmtree(git_dir_path)


# Define function to add .env.development file
def add_env_dev():
    """
    This function creates a '.env.development' file in the new project directory.

    It writes the string "NODE_ENV=development" to the file, which sets the NODE_ENV environment
    variable to 'development'.
    This is typically used to indicate that the application is running in a development environment.
    """
    env_dev_name = '/.env.development'
    env_dev_path = new_project_dir + env_dev_name

    # Open the '.env.development' file in write mode
    with open(env_dev_path, 'w', encoding='utf-8') as dev_file:
        # Define the content to be written to the file
        dev_file_content = "NODE_ENV=development"
        # Write the content to the file
        dev_file.write(dev_file_content)
        # Close the file
        dev_file.close()


# Define function to add .env.production file
def add_env_prod():
    """
    This function creates a '.env.production' file in the new project directory.

    It writes the string "NODE_ENV=production" to the file, which sets the NODE_ENV environment
    variable to 'production'.
    This is typically used to indicate that the application is running in a production environment.
    """
    env_prod_name = '/.env.production'
    env_prod_path = new_project_dir + env_prod_name

    # Open the '.env.production' file in write mode
    with open(env_prod_path, 'w', encoding='utf-8') as prod_file:
        # Define the content to be written to the file
        prod_file_content = "NODE_ENV=production"
        # Write the content to the file
        prod_file.write(prod_file_content)
        # Close the file
        prod_file.close()


# Define function to intialise an empty git repository
def add_git():
    """
    This function initializes a new Git repository in the new project directory.

    It uses the 'git init' command, which is run as a subprocess.
    The 'cwd' parameter is used to specify the new project directory as the current working directory for the command.
    """
    # Initialize a new Git repository in the new project directory
    subprocess.run(['git', 'init'],
                   cwd=new_project_dir, shell=IF_WIN, check=True)


# Define function to save the the 'without_args.py' in user's machine
def save_without_args_script():
    """
    This function checks if a specific directory (USER_BIN_DIR) exists in the user's home directory.
    If the directory does not exist, it creates one.

    It then checks if a specific Python script (without_args.py) exists in that directory.
    If the script does not exist, it downloads the script from a given URL and saves it in the directory.
    If the script already exists, it removes the old script before downloading the new one.
    """
    without_args_name = "/without_args.py"
    without_args_path = USER_BIN_DIR + without_args_name
    without_args_url = RAW_REPO_URL + without_args_name

    # Check if the USER_BIN_DIR directory exists
    if not os.path.isdir(USER_BIN_DIR):
        # If not, create the directory in the user's home directory
        subprocess.run(['mkdir', 'bin_scripts'], shell=IF_WIN, cwd=Path.home(), check=True)

    # Check if the script already exists in the directory
    if os.path.exists(without_args_path):
        # If it does, remove the old script
        os.remove(without_args_path)

    # Download the Python script from the URL and save it in the USER_BIN_DIR
    urllib.request.urlretrieve(without_args_url, without_args_path)


def save_config_file():
    """
    This function is responsible for saving the configuration file. It first checks if the USER_BIN_DIR 
    directory exists.
    If it doesn't, it creates the directory in the user's home directory. 
    Then it checks if the script already exists in the directory.
    If it does, it removes the old script. Finally, it retrieves the configuration file from the 
    CLOUD_CONFIG_URL and saves it to the CONFIG_PATH.
    """
    config_name = "/pyproject.toml"
    config_path = USER_BIN_DIR + config_name
    config_url = RAW_REPO_URL + config_name

    # Check if the USER_BIN_DIR directory exists
    if not os.path.isdir(USER_BIN_DIR):
        # If not, create the directory in the user's home directory
        subprocess.run(['mkdir', 'bin_scripts'], shell=IF_WIN, cwd=Path.home(), check=True)

    # Check if the script already exists in the directory
    if os.path.exists(config_path):
        # If it does, remove the old config file
        os.remove(config_path)

    urllib.request.urlretrieve(config_url, config_path)


# Define function to add the alias 'mkexp' for exectuing 'without_args.py'
def handle_alias_save():
    """
    This function handles the process of saving an alias for the Python script.

    If the operating system is Windows, it downloads a PowerShell script, runs it, and then deletes it.
    If the operating system is macOS or Linux, it downloads a Bash script, runs it, and then deletes it.
    """
    # If the operating system is Windows
    if (IF_WIN):
        # Check if the directory exists
        if (not os.path.isdir(USER_BIN_DIR)):
            # If not, create the directory
            subprocess.run(['mkdir', 'bin_scripts'], shell=True, cwd=Path.home(), check=True)

        # Name & Path of the PowerShell script to download
        ps1_script_name = '/win_update_profile.ps1'
        ps1_script_path = USER_BIN_DIR + ps1_script_name

        # If the PowerShell script already exists, remove it
        if (os.path.exists(ps1_script_path)):
            os.remove(ps1_script_path)

        # URL of the PowerShell script to download

            # pylint: disable=line-too-long
            # disable for only one line
        ps1_url = RAW_REPO_URL + "/win_update_profile.ps1"

        # Download the PowerShell script and save it in the USER_BIN_DIR
        urllib.request.urlretrieve(ps1_url, ps1_script_path)

        # Run the PowerShell script
        subprocess.run(['powershell.exe', '-ExecutionPolicy', 'Unrestricted',
                        '.' + ps1_script_name], shell=True, cwd=USER_BIN_DIR, check=True)

        # Refresh the PowerShell profile
        subprocess.run(['powershell.exe', '. $PROFILE'], shell=True, check=True)

        # Delete the PowerShell script from the USER_BIN_DIR
        os.remove(ps1_script_path)

    # If the operating system is macOS or Linux
    if (OS_NAME == 'Darwin' or OS_NAME == 'Linux'):
        # If the directory does not exist, create it
        if (not os.path.isdir(USER_BIN_DIR)):
            subprocess.run(['mkdir', 'bin_scripts'], cwd=Path.home(), check=True)

        # Name of the Bash script to download
        sh_script_name = '/unix_update_profile.sh'
        sh_script_path = USER_BIN_DIR + sh_script_name

        # If the Bash script already exists, remove it
        if (os.path.exists(sh_script_path)):
            os.remove(sh_script_path)

        # URL of the Bash script to download

            # pylint: disable=line-too-long
            # disable for only one line
        sh_url = RAW_REPO_URL + "/unix_update_profile.sh"

        # Download the Bash script and save it in the USER_BIN_DIR
        urllib.request.urlretrieve(sh_url, sh_script_path)

        # Run the Bash script with prefered shell and refresh the Bash shell
        if (not args.shell == ''):
            subprocess.run(['bash', '.' + sh_script_name, args.shell, '&& exec bash'], cwd=USER_BIN_DIR, check=True)

        # Run the Bash script and refresh the Bash shell
        subprocess.run(['bash', '.' + sh_script_name, '&& exec bash'], cwd=USER_BIN_DIR, check=True)

        # Delete the Bash script from the USER_BIN_DIR
        os.remove(sh_script_path)


# Remove biome if user doesn't want it
if (not args.biome):
    remove_biome()

# Add .env.development and .env.production files
add_env_dev()
add_env_prod()

# Remove existing git
remove_git()

# Initialize git if user wants it
if args.git:
    add_git()

# Call the save_config_file funtion to download the Config file
save_config_file()

# Call the save_args_script function to download the Python script
save_without_args_script()

# If the alias argument is set to True
if (args.alias):
    # Handle the alias saving process
    handle_alias_save()
