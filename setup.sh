#!/bin/bash
echo "=========================================================================================="
echo "Welcome to the setup. This script creates a virtual environment .env in the current"
echo "working directory, installs all the necessary packages into it, and runs the application."
echo "The environment is deactivated and deleted and the cache file is deleted as soon as the"
echo "server is stopped. Thus, this script can be run multiple times without any conflict." 
echo "=========================================================================================="
echo "Creating environment..."
python3 -m venv .env
echo "Creating database directory"
mkdir db_directory
echo "Enabling environment and installing necessary libraries..."
. .env/bin/activate;
pip install --upgrade -r requirements.txt
python main.py
echo "Deactivating environment..."
deactivate
echo "Removing environment..."
rm -r .env
if [ -e __pycache__ ]; then
    echo "Removing __pycache__ ..."  
    rm -r __pycache__
fi