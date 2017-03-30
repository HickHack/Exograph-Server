function init() {
    chmod +x ./dependencies.sh
    ./dependencies.sh
    setupExograph
    launchServices

}

function setupExograph() {
	cd ~/
	sudo npm install -g node-sass
	npm install
}

function launchServices() {
	sudo neo4j start
	ls
	node start bin/www
}

init