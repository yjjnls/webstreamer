
const WebStreamer  = require('./lib/webstreamer').WebStreamer;
var _RTSPTestServer = require('./lib/rtsptestserver').RTSPTestServer;
//var _IAVanalyzer = require('./lib/avanalyzer').IAVAnalyzer;
var webstreamer_=null;

function Initialize(option){

	if( webstreamer_ ){
		return;
	}

	webstreamer_ = new WebStreamer();
	return webstreamer_.initialize();

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

class RTSPTestServer extends _RTSPTestServer  {
	constructor(name) {
		super(webstreamer_,name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _RTSPTestClient = require('./lib/rtsptestclient').RTSPTestClient
class RTSPTestClient extends _RTSPTestClient  {
	constructor(name) {
		super(webstreamer_,name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;

    }
}

const _LiveStream = require('./lib/livestream').LiveStream
class LiveStream extends _LiveStream {
	constructor(name) {
		super(webstreamer_, name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;

	}
}

//class IAVanalyzer extends _IAVanalyzer  {
//	constructor(name) {
//        super(webstreamer_,name);
//    }
//}

module.exports = {
	WebStreamer : WebStreamer,

	Initialize : Initialize,
	Terminate  : Terminate,
	Version    : Version,
	RTSPTestServer : RTSPTestServer,
	RTSPTestClient : RTSPTestClient,
	LiveStream: LiveStream
};
