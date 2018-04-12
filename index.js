
const WebStreamer  = require('./lib/webstreamer').WebStreamer;
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

	return new Promise(function (resolve, reject) {       
		webstreamer_.terminate()
		.then( data =>{
			webstreamer_=null;
			resolve(data);

		}).catch( err =>{
			webstreamer_=null;
			reject(err);
		});
	})
}

function Version(){
	return webstreamer_.version();
}

var _RTSPTestServer = require('./lib/rtsptestserver').RTSPTestServer;
class RTSPTestServer extends _RTSPTestServer  {
	constructor(name) {
		super(webstreamer_,name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _GStreamerVideoTestSrcAnalyzer = require('./lib/gsttestsrcanalyzer').GStreamerVideoTestSrcAnalyzer
class GStreamerVideoTestSrcAnalyzer extends _GStreamerVideoTestSrcAnalyzer  {
	constructor(name) {
		super(webstreamer_,name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _GStreamerAudioTestSrcAnalyzer = require('./lib/gsttestsrcanalyzer').GStreamerAudioTestSrcAnalyzer
class GStreamerAudioTestSrcAnalyzer extends _GStreamerAudioTestSrcAnalyzer  {
	constructor(name) {
		super(webstreamer_,name);
		webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const utils = require('./lib/utils')
module.exports = {
	utils : utils,
	WebStreamer : WebStreamer,

	Initialize : Initialize,
	Terminate  : Terminate,
	Version    : Version,

	RTSPTestServer : RTSPTestServer,
	GStreamerVideoTestSrcAnalyzer: GStreamerVideoTestSrcAnalyzer,
	GStreamerAudioTestSrcAnalyzer: GStreamerAudioTestSrcAnalyzer
};
