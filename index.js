
const WebStreamer  = require('./lib/webstreamer').WebStreamer;
var _RTSPTestServer = require('./lib/rtsptestserver').RTSPTestServer;
//var _IAVanalyzer = require('./lib/avanalyzer').IAVAnalyzer;
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

class RTSPTestServer extends _RTSPTestServer  {
	constructor(name) {
        super(webstreamer_,name);
    }
}

_IElementWatcher = require('./lib/elementwatcher').IElementWatcher
class IElementWatcher extends _IElementWatcher  {
	constructor(name) {
        super(webstreamer_,name);
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
	IElementWatcher : IElementWatcher
};
