const liveStreamBufGenerator = require('./lib/livestream');
const WebStreamer = require('./lib/webstreamer');

class LiveStreamWebStreamer {
	constructor(libname) {
		this._webstreamer = new WebStreamer(libname);
        let options = {
            plugin: {
                directory: __dirname + '/lib'
            },
            user: 'xxxxxx'
        };
        this._webstreamer.initialize(options);

	}

    terminate(buf) {
        return this._webstreamer.terminate();
	}

	async callLiveStreamCreate(streamId, endpointId, endpointType, rtspurl, videoCodec, audioCodec) {
		let buf = liveStreamBufGenerator.generateLiveStreamCreateMsgBuf(streamId, endpointId, endpointType, rtspurl, videoCodec, audioCodec);
		let res = await this._webstreamer.call_(buf);
	}

	async callLiveStreamDestroy(streamId) {
		let buf = liveStreamBufGenerator.generateLiveStreamDestroyMsgBuf(streamId);
		let res = await this._webstreamer.call_(buf);
		return res;
	}

	async callLiveStreamAddEndpoint(streamId, endpointId) {
		let buf = liveStreamBufGenerator.generateLiveStreamAddEndpointMsgBuf(streamId, endpointId);
		let res = await this._webstreamer.call_(buf);
		return res;
	}

	async callLiveStreamRemoveEndpoint(streamId, endpointId) {
		let buf = liveStreamBufGenerator.generateLiveStreamRemoveEndpointMsgBuf(streamId, endpointId);
		let res = await this._webstreamer.call_(buf);
		return res;
	}
 }



//example = path.join(__dirname,'/bin/calc'+_EXT)
module.exports = {
    LiveStreamWebStreamer,
};



//const Plugin = require('node-plugin').Plugin

