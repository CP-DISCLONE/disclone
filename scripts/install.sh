#!/bin/bash
# This script will install all required dependencies for the application

# Ensure that the whole script runs or dump script if error
set -eu -o pipefail

# Determine OS name
os=$(uname)

echo "Installing machine dependencies"

# MacOS Install
if [ "$os" = "Darwin" ]; then
    echo "This is an Apple Mac Machine"
    brew update
    brew install python npm
    sudo npm install -g n
    sudo n stable

# Linux Install
elif [ "$os" = "Linux" ]; then
    echo "This is a Linux Machine"
    if [[ -f /etc/redhat-release ]]; then
        pkg_manager=yum
    elif [[ -f /etc/debian_version ]]; then
        pkg_manager=apt
    fi

    if [[ $pkg_manager = "yum" ]]; then
        sudo yum install -y python3 python3-pip python3-setuptools python3.12-venv npm
        sudo npm install -g n
        sudo n stable
    elif [[ $pkg_manager = "apt" ]]; then
        sudo apt-get install -y python3 python3-pip python3-setuptools python3.12-venv npm
        sudo npm install -g n
        sudo n stable
    fi

else
    echo "Unsupported OS"
    exit 1

fi

echo "Installed Machine Dependencies"

# Install all Project Dependencies for code visibility support

echo "Installing Project Dependencies"

cd ../frontend
npm install

cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt

echo "Installed Project Dependencies"