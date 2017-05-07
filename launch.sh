#!/usr/bin/env bash

function init() {
    cd ~/
    fetchExograph
    fetchExtractor
    triggerExograph
    triggerExtractor
}

function fetchExograph() {
    rm -rf ~/Exograph-Server
	git clone -b finalDeployment https://github.com/HickHack/Exograph-Server.git
}

triggerExograph() {
    chmod +x ~/Exograph-Server/*.sh
    ~/Exograph-Server/deploy.sh
}

function fetchExtractor() {
     rm -rf ~/Extractor-API
	 git clone -b finalDeployment https://github.com/HickHack/Extractor-API.git
	 pip3 install --upgrade -r ~/Extractor-API/requirements.txt
}

triggerExtractor() {
    chmod +x ~/Extractor-API/*.sh
    ./deploy.sh
}

init