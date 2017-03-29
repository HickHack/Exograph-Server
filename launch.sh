function init() {
    fetchExograph
    fetchExtractor
    triggerExograph
    triggerExtractor
}

function fetchExograph() {
	cd ~/
	rm -rf Exograph-Server
	git clone https://github.com/HickHack/Exograph-Server.git
	cd Exograph-Server
}

triggerExograph() {
    cd ~/Exograph-Server/
    chmod +x ~/Exograph-Server/*.sh
    ./deploy.sh
}

function fetchExtractor() {
	 cd ~/
	 rm -rf Extractor-API
	 git clone https://github.com/HickHack/Extractor-API.git
	 cd ~/Extractor-API
	 pip3 install --upgrade -r requirements.txt
}

triggerExtractor() {
    cd ~/Extractor-API/
    chmod +x ~/Extractor-API/*.sh
    ./deploy.sh
}

init