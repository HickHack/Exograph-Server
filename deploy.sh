#!/usr/bin/env bash

function init() {
    chmod +x ~/Exograph-Server/dependencies.sh
    ./dependencies.sh
    setupExograph
    launchServices

}

function setupExograph() {
	sudo npm install -g node-sass
	npm install
}

function launchServices() {
	sudo neo4j start
	node start ~/Exograph-Server/bin/www &
}

init