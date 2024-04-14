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
import platform
from threading import Thread
from shutil import rmtree

# Constants
OS_NAME = platform.system()  # Get OS name
IF_WIN = (OS_NAME == 'Windows')  # Check if OS is Windows

# Print initial messages to the user
print("🚀 This script will create a new project based on the template_express_pino repository.")
print("🛠️ You can customize the project by answering the following questions:")

# Ask user if they want to use biome.js as linter & formatter
while True:
    want_biome = input(
        "🔧 Do you want to use biome.js as linter & formatter? (Y/N, default is N): ")
    if (not want_biome):
        want_biome = 'n'
    elif (want_biome.lower() == 'y'):
        want_biome = True
        break
    elif (want_biome.lower() == 'n'):
        want_biome = False
        break
    else:
        print("❌ Invalid input. Please enter 'Y' or 'N'.")

# Ask user if they want to initialize a git repo in the new project
while True:
    want_git = input(
        '🔧 Do you want to initialize a git repo in the new project? (Y/N, default is N): ')
    if (not want_git):
        want_git = 'n'
    elif (want_git.lower() == 'y'):
        want_git = True
        break
    elif (want_git.lower() == 'n'):
        want_git = False
        break
    else:
        print("❌ Invalid input. Please enter 'Y' or 'N'.")


# Ask user to enter the name for the new project directory
new_dir_name = input(
    "📁 Enter the name for the new project directory (default is 'template_express_pino'): ")
if not new_dir_name:
    new_dir_name = "template_express_pino"


# Print message about creating new project
print(f"🚀 Creating new project in directory {new_dir_name}...")

# Define new project directory and clone command
new_project_dir = os.getcwd() + f'/{new_dir_name}'
CLONE_CMD = "git clone https://github.com/Shivansh-Khunger/template_express_pino"

# Execute clone command and rename the cloned directory
os.system(CLONE_CMD)
os.rename(os.getcwd() + '/template_express_pino',
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
    subprocess.run(['npm', 'i'], shell=IF_WIN, cwd=new_project_dir, check=True)


# Create a new thread with install_dependencies as the target function and start it
Thread(target=install_dependencies).start()


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


# Define function to initialize git
def add_git():
    """
    This function initializes a new Git repository in the new project directory.

    It uses the 'git init' command, which is run as a subprocess.
    The 'cwd' parameter is used to specify the new project directory as the current working directory for the command.
    """
    # Initialize a new Git repository in the new project directory
    subprocess.run(['git', 'init'],
                   cwd=new_project_dir, shell=IF_WIN, check=True)


# Remove biome if user doesn't want it
if (not want_biome):
    remove_biome()

# Add .env.development and .env.production files
add_env_dev()
add_env_prod()

# Remove existing git
remove_git()

# Initialize git if user wants it
if want_git:
    add_git()
