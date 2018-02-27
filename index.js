const liveStreamBufGenerator = require('./lib/livestreambuf');
const WebStreamer = require('./lib/webstreamer');

let webstreamer = new WebStreamer('webstreamer');
let options = {
    plugin: {
        directory: __dirname + '/lib'
    },
    user: 'xxxxxx'
};

webstreamer.initialize(options);

class LiveStream {
	constructor() {
	    if(!webstreamer) {
            webstreamer = new WebStreamer(libname);
            webstreamer.initialize(options);
        }
	}

    terminate(buf) {
        webstreamer.terminate();
        webstreamer = null;
	}

	async createLiveStream(streamId, endpointId, endpointType, rtspurl, videoCodec, audioCodec) {
		let buf = liveStreamBufGenerator.generateLiveStreamCreateMsgBuf(streamId, endpointId, endpointType, rtspurl, videoCodec, audioCodec);
		let res = await webstreamer.call_(buf);
	}

	async destroyLiveStream(streamId) {
		let buf = liveStreamBufGenerator.generateLiveStreamDestroyMsgBuf(streamId);
		let res = await webstreamer.call_(buf);
		return res;
	}

	async liveStreamAddEndpoint(streamId, endpointId) {
		let buf = liveStreamBufGenerator.generateLiveStreamAddEndpointMsgBuf(streamId, endpointId);
		let res = await webstreamer.call_(buf);
		return res;
	}

	async liveStreamRemoveEndpoint(streamId, endpointId) {
		let buf = liveStreamBufGenerator.generateLiveStreamRemoveEndpointMsgBuf(streamId, endpointId);
		let res = await webstreamer.call_(buf);
		return res;
	}
 }

module.exports = {
    LiveStream: LiveStream,
};
