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
from shutil import rmtree


OS_NAME = platform.system()

# Create the parser
parser = argparse.ArgumentParser(
    description='Create a new project based on the template_express_pino repository.')

# Add the arguments
parser.add_argument('--biome', type=bool, default=False,
                    help="Use biome.js as linter & formatter haven't heard about it visit https://biomejs.dev/")

parser.add_argument('--git', type=bool, default=True,
                    help='Initialize a git repo in the new project')

parser.add_argument('--dir', type=str, default='template_express_pino',
                    help='Name for the new project directory')

parser.add_argument('--alias', type=bool, default=True,
                    help="Add alias 'mkexp' to run this script from anywhere in Powershell")

# Parse the arguments
args = parser.parse_args()

# Define new project directory and clone command
new_project_dir = os.getcwd() + f'/{args.dir}'
CLONE_CMD = "git clone https://github.com/Shivansh-Khunger/template_express_pino"

# Execute clone command and rename the cloned directory
os.system(CLONE_CMD)
os.rename(os.getcwd() + '/template_express_pino',
          new_project_dir)


# Define function to remove biome
def remove_biome():
    """
    This function removes the 'biome.json' file and the '@biomejs/biome' dependency from the 'package.json' file.
    It also removes the first recommendation from the '.vscode/extensions.json' file in the new project directory.
    """
    # Remove the 'biome.json' file
    os.remove(new_project_dir + '/biome.json')

    # Open the 'package.json' file and load its JSON content
    with open(new_project_dir+'/package.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

        # Remove the '@biomejs/biome' dependency
        data['devDependencies'].pop('@biomejs/biome')

        # Write the updated JSON data back to the 'package.json' file
        with open(new_project_dir+'/package.json', 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

    # Open the '.vscode/extensions.json' file and load its JSON content
    with open(new_project_dir+'/.vscode/extensions.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

        # Remove the first recommendation
        data['recommendations'].pop(0)

        # Write the updated JSON data back to the '.vscode/extensions.json' file
        with open(new_project_dir+'/.vscode/extensions.json', 'w', encoding='utf-8') as file:
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
    git_dir = new_project_dir + '/.git'

    # Walk through the .git directory
    for root, dirs, files in os.walk(git_dir):
        # For each directory in the .git directory
        for each_dir in dirs:
            # Change the permissions to ensure the user has read, write, and execute permissions
            os.chmod(os.path.join(root, each_dir), stat.S_IRWXU)
        # For each file in the .git directory
        for file in files:
            # Change the permissions here as well like before
            os.chmod(os.path.join(root, file), stat.S_IRWXU)

    # Remove the entire .git directory
    rmtree(git_dir)


# Define function to add .env.development file
def add_env_dev():
    """
    This function creates a '.env.development' file in the new project directory.

    It writes the string "NODE_ENV=development" to the file, which sets the NODE_ENV environment
    variable to 'development'.
    This is typically used to indicate that the application is running in a development environment.
    """
    # Open the '.env.development' file in write mode
    with open(new_project_dir+'/.env.development', 'w', encoding='utf-8') as dev_file:
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
    # Open the '.env.production' file in write mode
    with open(new_project_dir+'/.env.production', 'w', encoding='utf-8') as prod_file:
        # Define the content to be written to the file
        prod_file_content = "NODE_ENV=production"
        # Write the content to the file
        prod_file.write(prod_file_content)
        # Close the file
        prod_file.close()


def add_git():
    """
    This function initializes a new Git repository in the new project directory.

    It uses the 'git init' command, which is run as a subprocess.
    The 'cwd' parameter is used to specify the new project directory as the current working directory for the command.
    """
    # Initialize a new Git repository in the new project directory
    subprocess.run(['git', 'init'], shell=True,
                   cwd=new_project_dir, check=True)


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

# Define the directory where the scripts will be stored
USER_BIN_DIR = str(Path.home())+'/bin_scripts'


# Function to download a Python script and save it in the USER_BIN_DIR
def save_without_args_script():
    """
    This function checks if a specific directory exists in the user's home directory.
    If the directory does not exist, it creates one.

    It then checks if a specific Python script exists in that directory.
    If the script does not exist, it downloads the script from a given URL and saves it in the directory.
    """
    # Check if the directory exists
    if (not os.path.isdir(USER_BIN_DIR)):
        # If not, create the directory
        subprocess.run(['mkdir', 'bin_scripts'], shell=True, cwd=Path.home(), check=True)

    if (not os.path.exists(USER_BIN_DIR + '/without_args.py')):
        # URL of the Python script to download

        # pylint: disable=line-too-long
        # disable for only one line
        script_url = "https://raw.githubusercontent.com/Shivansh-Khunger/scripts_template_express_pino/without_args.py"

        # Download the Python script and save it in the USER_BIN_DIR
        urllib.request.urlretrieve(
            script_url, USER_BIN_DIR + '/without_args.py')

    handle_alias_save()


def handle_alias_save():
    """s"""
    # To download a PowerShell script, run it, and then delete it
    if (OS_NAME == 'Windows'):
        # Check if the directory exists
        if (not os.path.isdir(USER_BIN_DIR)):
            # If not, create the directory
            subprocess.run(['mkdir', 'bin_scripts'], shell=True, cwd=Path.home(), check=True)

        # Name of the PowerShell script to download
        ps1_script_name = '/win_update_profile.ps1'

        if (not os.path.exists(USER_BIN_DIR + ps1_script_name)):
            # URL of the PowerShell script to download

            # pylint: disable=line-too-long
            # disable for only one line
            ps1_url = "https://raw.githubusercontent.com/Shivansh-Khunger/scripts_template_express_pino/update_profile.ps1"

            # Download the PowerShell script and save it in the USER_BIN_DIR
            urllib.request.urlretrieve(ps1_url, USER_BIN_DIR + ps1_script_name)

        # Run the PowerShell script
        subprocess.run(['powershell.exe', '-ExecutionPolicy', 'Unrestricted',
                        '.' + ps1_script_name], shell=True, cwd=USER_BIN_DIR, check=True)

        subprocess.run(['powershell.exe', '. $PROFILE'], shell=True, check=True)
        # Delete the PowerShell script from the USER_BIN_DIR
        os.remove(USER_BIN_DIR + ps1_script_name)

    if (OS_NAME == 'Darwin' or OS_NAME == 'Linux'):
        # If not, create the directory
        subprocess.run(['mkdir', 'bin_scripts'], shell=True, cwd=Path.home(), check=True)

        # Name of the Bash script to download
        sh_script_name = '/unix_update_profile.sh'

        if (not os.path.exists(USER_BIN_DIR + sh_script_name)):
            # URL of the Bash script to download

            # pylint: disable=line-too-long
            # disable for only one line
            sh_url = "https://raw.githubusercontent.com/Shivansh-Khunger/scripts_template_express_pino/update_profile.sh"

            # Download the Bash script and save it in the USER_BIN_DIR
            urllib.request.urlretrieve(sh_url, USER_BIN_DIR + sh_script_name)

        subprocess.run(['bash', '.' + sh_script_name], cwd=USER_BIN_DIR, check=True)
        # Delete the Bash script from the USER_BIN_DIR
        os.remove(USER_BIN_DIR + sh_url)


# If the alias argument is set to True
if (args.alias):
    # Call the save_args_script function to download the Python script
    save_without_args_script()
