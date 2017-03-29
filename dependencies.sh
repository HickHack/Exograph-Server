function setupNeo4j() {
    wget --no-check-certificate -O - https://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
    sudo touch /etc/apt/sources.list.d/neo4j.list
    echo 'deb http://debian.neo4j.org/repo stable/' | sudo tee --append /etc/apt/sources.list.d/neo4j.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y neo4j
}

function setupJava() {
     sudo apt install -y default-jre default-jre-headless
     sudo update-alternatives --set java /usr/lib/jvm/java-8-openjdk-amd64/bin/java
     sudo update-alternatives --set javac /usr/lib/jvm/java-8-openjdk-amd64/bin/javac
}

function setupNodeJs() {
	sudo apt-get update
	sudo apt-get install -y nodejs
	sudo apt-get install -y npm
	sudo apt-get install -y build-essential
	sudo ln -s /usr/bin/nodejs /usr/bin/node
}

function changeNeo4jPassword() {
    curl -H "Content-Type: application/json" -X POST -d '{"password":"123456"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password
     curl -H "Content-Type: application/json" -X POST -d '{"password":"neo4j"}' -u neo4j:123456 http://localhost:7474/user/neo4j/password
}

function packageInstall() {
    sudo npm install -g node-sass
	npm install
}

function init() {
    setupJava
	setupNeo4j
	setupNodeJs
    changeNeo4jPassword
    packageInstall
}

init