
const WebStreamer  = require('./lib/webstreamer').WebStreamer;
var RTSPTestServerBase = require('./lib/rtsptestserver').RTSPTestServer;
var webstreamer_=null

function Initialize(option){

	if( webstreamer_ ){
		return;
	}

    webstreamer_ = new WebStreamer()

}

function Terminate(){
	if( !webstreamer_ ){
		return;
	}
	return webstreamer_.terminate();
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
	RTSPTestServer : RTSPTestServer
};
