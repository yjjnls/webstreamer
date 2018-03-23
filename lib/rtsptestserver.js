

var IProcessor = require('./processor').IProcessor
class RTSPTestServer extends IProcessor  {

    constructor(webstreamer,name) {
        super(webstreamer,name);
        this.type = 'rtsptestserver'
        this.name = name
        this.webstreamer = webstreamer
    }

    startup(option){

    }

    
}

module.exports = {
    RTSPTestServer : RTSPTestServer
};