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
import time
import tomllib
import subprocess
import platform
import urllib.request
from threading import Thread
from pathlib import Path
from shutil import rmtree
import toml

# Constants
OS_NAME = platform.system()  # Get OS name
IF_WIN = (OS_NAME == 'Windows')  # Check if OS is Windows
USER_BIN_DIR = str(Path.home())+'/bin_scripts'  # Path to bin_scripts

TEMPLATE_REPO_URL = "https://github.com/Shivansh-Khunger/template-express-nitro"  # Template URL
REPO_URL = "https://github.com/Shivansh-Khunger/express-nitro"  # Repository URL
RAW_REPO_URL = "https://raw.githubusercontent.com/Shivansh-Khunger/express-nitro/main"  # Raw repository URL


def get_version_info():
    """
    Checks if the local project version is the latest when compared to the version in the cloud repository.

    The function loads the local project's version from a TOML file and compares it with the
    version in the cloud repository.
    The version numbers are split into a list of integers and compared in reverse
    order (patch, minor, major).
    If any component of the local version is less than the corresponding component of the
    cloud version, the function returns False, indicating that the local version is not the latest.
    If all components are equal or greater, the function returns True, indicating that the
    local version is the latest or ahead of the cloud version.
    """

    config_name = "/pyproject.toml"
    config_path = USER_BIN_DIR + config_name
    config_url = RAW_REPO_URL + config_name

    current_config = toml.load(config_path)
    current_version_str = current_config["project"]["version"]
    current_version = [int(x, 10) for x in current_version_str.split('.')]

    with urllib.request.urlopen(config_url) as response:
        cloud_config = tomllib.load(response)
        cloud_version_str = cloud_config["project"]["version"]
        cloud_version = [int(x, 10) for x in cloud_version_str.split('.')]

    for i in range(len(current_version) - 1, -1, -1):
        if (current_version[i] < cloud_version[i]):
            return False, current_version_str, cloud_version_str, cloud_config

    return True, current_version_str, cloud_version_str, None


# Retrieving version information and cloud configuration data
IF_LATEST, CURRENT_VERSION, CLOUD_VERSION, CLOUD_CONFIG = get_version_info()


def main():
    """This funtion encloses the business logic of the script."""

    # Print initial messages to the user
    print("🚀 This script will create a new project based on the template-express-nitro repository.")
    print("🛠️ You can customize the project by answering the following questions:")

    # Ask user if they want to use biome.js as linter & formatter
    while True:
        want_biome = input(
            "🔧 Do you want to use biome.js as linter & formatter? (Y/N, default is N): ")
        if (not want_biome):
            want_biome = 'n'
        if (want_biome.lower() == 'y'):
            want_biome = True
            break
        if (want_biome.lower() == 'n'):
            want_biome = False
            break
        else:
            print("❌ Invalid input. Please enter 'Y' or 'N'.")

    # Ask user if they want to initialize a git repo in the new project
    while True:
        want_git = input(
            '🔧 Do you want to initialize a git repo in the new project? (Y/N, default is Y): ')
        if (not want_git):
            want_git = 'y'
        if (want_git.lower() == 'y'):
            want_git = True
            break
        if (want_git.lower() == 'n'):
            want_git = False
            break
        else:
            print("❌ Invalid input. Please enter 'Y' or 'N'.")

    # Ask user to enter the name for the new project directory
    new_dir_name = input(
        "📁 Enter the name for the new project directory (default is 'template-express-nitro'): ")
    if not new_dir_name:
        new_dir_name = "template-express-nitro"

    # Print message about creating new project
    print(f"🚀 Creating new project in directory {new_dir_name}...")

    # Define new project directory and clone command
    new_project_dir = os.getcwd() + f'/{new_dir_name}'

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
        If the subprocess call exits with a non-zero code, a CalledProcessError will 
        be raised (because 'check' is True).
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

    # Define function to initialize git
    def add_git():
        """
        This function initializes a new Git repository in the new project directory.

        It uses the 'git init' command, which is run as a subprocess.
        The 'cwd' parameter is used to specify the new project directory as the 
        current working directory for the command.
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


def update_current_script():
    """
    Updates the current script from a cloud source.

    This function first calls the nested function 'download_cloud_config' which retrieves the cloud configuration file
    from the 'CLOUD_CONFIG_URL' and saves it as 'CONFIG_NAME'. It then calls the nested function 
    'update_without_args_script'
    which opens the local script file ('CONFIG_NAME') in write-binary mode, reads the latest version of 
    the script from the 
    'WITHOUT_ARGS_URL', and writes it into the local file. 

    If the urllib.request.urlopen call fails to open the 'WITHOUT_ARGS_URL', an URLError will be raised.
    """

    def update_config():
        """
        This function updates the local config file with the latest version from the cloud.
        """
        config_name = "/pyproject.toml"
        config_path = USER_BIN_DIR + config_name

        if (CLOUD_CONFIG):
            with open(config_path, "w", encoding='utf-8') as current_config:
                toml.dump(CLOUD_CONFIG, current_config)

    def update_without_args():
        """
        This function updates the local script file with the latest version from the cloud.
        """
        without_args_name = "/without_args.py"
        without_args_path = USER_BIN_DIR + without_args_name
        without_args_url = RAW_REPO_URL + without_args_name

        with open(without_args_path, "wb") as current_file:
            with urllib.request.urlopen(without_args_url) as response:
                cloud_file = response.read()
                current_file.write(cloud_file)

    update_config()
    update_without_args()


def restart():
    """
    Restarts the script with updated code.

    This function first outputs a message for the user with an animation which lasts for 2 seconds.
    After that the terminal is cleared and the user starts interacting with the new updated script.
    """
    # Left in the code as alternate option
    # symbols = ['⣾', '⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽']

    symbols = ['/', '-', '|', '/']
    i = 0
    end_time = time.time() + 2

    while time.time() < end_time:
        i = (i + 1) % len(symbols)
        print('\r\033[K🔄 Restarting with new version %s' % symbols[i], flush=True, end='')
        time.sleep(0.17)

        os.system('cls||clear')
        subprocess.run(['python', f'{USER_BIN_DIR}/without_args.py'], shell=IF_WIN,  check=True)


if (not IF_LATEST):
    while True:
        # pylint: disable=line-too-long
        # disable for only one line
        continue_with_old = input(
            f"🚀 This script is currently at version {CURRENT_VERSION}. A new version {CLOUD_VERSION} is available. You can find the changelog at \n{REPO_URL}/releases/ \nDo you still want to continue with this version? (default is 'N')? ")
        if (not continue_with_old):
            continue_with_old = 'n'
        if (continue_with_old.lower() == 'y'):
            continue_with_old = True
            break
        elif (continue_with_old.lower() == 'n'):
            continue_with_old = False
            break
        else:
            print("❌ Invalid input. Please enter 'Y' or 'N'.")

    if (continue_with_old):
        main()
    else:
        update_current_script()
        restart()

else:
    main()
