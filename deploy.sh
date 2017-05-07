#!/usr/bin/env bash

function init() {
    # chmod +x ~/Exograph-Server/dependencies.sh
    # ~/Exograph-Server/dependencies.sh
    setupExograph
    launchServices

}

function setupExograph() {
	sudo npm install -g node-sass
	cd  ~/Exograph-Server
	sudo npm install
	cd ../
}

function launchServices() {
	sudo neo4j start
	node start ~/Exograph-Server/bin/www &
}

init