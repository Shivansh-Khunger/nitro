import os
import json
import stat
import subprocess
from shutil import rmtree

# Print initial messages to the user
print("🚀 This script will create a new project based on the template_express_pino repository.")
print("🛠️ You can customize the project by answering the following questions:")

# Ask user if they want to use biome.js as linter & formatter
while True:
    want_biome = input(
        "🔧 Do you want to use biome.js as linter & formatter? (Y/N, default is N): ")
    if not want_biome:
        want_biome = 'n'
        break
    if want_biome.lower() == 'y':
        want_biome = True
        break
    elif want_biome.lower() == 'n':
        want_biome = False
        break
    else:
        print("❌ Invalid input. Please enter 'Y' or 'N'.")

# Ask user if they want to initialize a git repo in the new project
while True:
    want_git = input(
        '🔧 Do you want to initialize a git repo in the new project? (Y/N, default is N): ')
    if not want_git:
        want_git = 'n'
        break
    if want_git.lower() == 'y':
        want_git = True
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
clone_cmd = "git clone https://github.com/Shivansh-Khunger/template_express_pino"

# Execute clone command and rename the cloned directory
os.system(clone_cmd)
os.rename(os.getcwd() + '/template_express_pino',
          new_project_dir)


# Define function to remove biome
def remove_biome():
    rmtree(new_project_dir + '/biome.json')

    with open(new_project_dir+'/package.json', 'r') as file:
        data = json.load(file)
        data['devDependencies'].pop('@biomejs/biome')
        print(data['devDependencies'])
        with open(new_project_dir+'/package.json', 'w') as file:
            json.dump(data, file, indent=4)


# Define function to remove git
def remove_git():
    git_dir = new_project_dir + '/.git'
    for root, dirs, files in os.walk(git_dir):
        for dir in dirs:
            os.chmod(os.path.join(root, dir), stat.S_IRWXU)
        for file in files:
            os.chmod(os.path.join(root, file), stat.S_IRWXU)

    rmtree(git_dir)


# Define function to add .env.development file
def add_env_dev():
    dev_file = open(new_project_dir+'/.env.development', 'w')
    dev_file_content = "NODE_ENV=development"
    dev_file.write(dev_file_content)
    dev_file.close()


# Define function to add .env.production file
def add_env_prod():
    prod_file = open(new_project_dir+'/.env.production', 'w')
    prod_file_content = "NODE_ENV=production"
    prod_file.write(prod_file_content)
    prod_file.close()


# Define function to initialize git
def add_git():
    subprocess.run(['git', 'init'], shell=True, cwd=new_project_dir)


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


