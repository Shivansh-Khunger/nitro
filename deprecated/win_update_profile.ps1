# Check if the PowerShell profile exists and store the result in $ifProfile
$ifProfile = Test-Path $PROFILE

# If the profile does not exist ($ifProfile is false), create it
if (!$ifProfile) {
    New-Item -path $PROFILE -type File -Force
}

# Define a new function mkexp that runs a Python script, and store the function definition in $appendContent
$appendContent = "`n`n# This function 'mkexp' runs a Python script located in the .bin directory of your home directory

function mkexp(){
    python $HOME/bin_scripts/without_args.py
}"

# Check if the function definition already exists in the PowerShell profile
$ifExists = Select-String -Path $PROFILE -Pattern 'function mkexp' -Quiet

# If the function definition does not exist ($ifExists is false), append it
if (!$ifExists) {
    Add-Content -Path $PROFILE $appendContent
    # Output a success message
    Write-Output "The command 'mkexp' has been successfully added to your PowerShell profile."
} else {
    Write-Output "The command 'mkexp' already exists in your PowerShell profile."
}