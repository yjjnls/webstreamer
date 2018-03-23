
const WebStreamer  = require('./lib/webstreamer').WebStreamer;
var RTSPTestServerBase = require('./lib/rtsptestserver').RTSPTestServer;
var webstreamer_=null

function Initialize(option){

	if( webstreamer_ ){
		return;
	}

	webstreamer_ = new WebStreamer()
	return webstreamer_.initialize()

}

function Terminate(){
	if( !webstreamer_ ){
		return;
	}
	return webstreamer_.terminate();
}

function Version(){
	return webstreamer_.version();
}

class RTSPTestServer extends RTSPTestServerBase  {
	constructor(name) {
        super(webstreamer_,name);
    }
}

module.exports = {
	WebStreamer : WebStreamer,

	Initialize : Initialize,
	Terminate  : Terminate,
	Version    : Version,
	RTSPTestServer : RTSPTestServer
};
