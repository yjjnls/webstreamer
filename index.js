
const WebStreamer = require('./lib/webstreamer').WebStreamer;
var webstreamer_ = null;
var tesseract = require('./lib/tesseract.js');

function Initialize(options) {
    if (webstreamer_) {
        throw new Error('Webstreamer has been initialized once!');
    }

    webstreamer_ = new WebStreamer();
    if (options) {
        for (var key in options) {
            if (webstreamer_.option[key]) {
                if (typeof webstreamer_.option[key] == 'object')
                    webstreamer_.option[key] = Object.assign(webstreamer_.option[key], options[key]);
                else
                    webstreamer_.option[key] = options[key];
            }
        }
    }
    return webstreamer_.initialize();
}

function Terminate() {
    if (!webstreamer_) {
        return;
    }

    return new Promise(function (resolve, reject) {
        webstreamer_.terminate()
            .then(data => {
                // webstreamer_=null;
                resolve(data);

            }).catch(err => {
                // webstreamer_=null;
                reject(err);
            });
    });
}

function Version() {
    return webstreamer_.version();
}
var default_option = require('./lib/analyzesource.js').option;

var _RTSPTestServer = require('./lib/rtsptestserver').RTSPTestServer;
class RTSPTestServer extends _RTSPTestServer {
    constructor(name, option = undefined) {
        if (!option) {
            super(webstreamer_, name, default_option);
        }
        else {
            super(webstreamer_, name, option);
        }
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

var _RTSPAnalyzer = require('./lib/rtspanalyzer').RTSPAnalyzer;
class RTSPAnalyzer extends _RTSPAnalyzer {
    constructor(name, url, option = undefined) {
        if (!option)
            super(webstreamer_, name, url, default_option);
        else
            super(webstreamer_, name, url, option);
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

var _WebRTCAnalyzer = require('./lib/rtspanalyzer').WebRTCAnalyzer;
class WebRTCAnalyzer extends _WebRTCAnalyzer {
    constructor(name, signal_bridge, role, id = 1234, option = undefined) {
        if (!option)
            super(webstreamer_, name, signal_bridge, id, default_option, role);
        else
            super(webstreamer_, name, signal_bridge, id, option, role);
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _GStreamerVideoTestSrcAnalyzer = require('./lib/gsttestsrcanalyzer').GStreamerVideoTestSrcAnalyzer;
class GStreamerVideoTestSrcAnalyzer extends _GStreamerVideoTestSrcAnalyzer {
    constructor(name) {
        super(webstreamer_, name);
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _GStreamerAudioTestSrcAnalyzer = require('./lib/gsttestsrcanalyzer').GStreamerAudioTestSrcAnalyzer;
class GStreamerAudioTestSrcAnalyzer extends _GStreamerAudioTestSrcAnalyzer {
    constructor(name) {
        super(webstreamer_, name);
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;
    }
}

const _LiveStream = require('./lib/livestream').LiveStream;
class LiveStream extends _LiveStream {
    constructor(name) {
        super(webstreamer_, name);
        webstreamer_.apps_[`${this.name}@${this.type}`] = this;

    }
}

const utils = require('./lib/utils');
module.exports = {
    option: default_option,
    utils: utils,
    WebStreamer: WebStreamer,

    Initialize: Initialize,
    Terminate: Terminate,
    Version: Version,

    RTSPTestServer: RTSPTestServer,
    RTSPAnalyzer: RTSPAnalyzer,
    GStreamerVideoTestSrcAnalyzer: GStreamerVideoTestSrcAnalyzer,
    GStreamerAudioTestSrcAnalyzer: GStreamerAudioTestSrcAnalyzer,
    LiveStream: LiveStream,
    WebRTCAnalyzer: WebRTCAnalyzer,
    tesseract: tesseract

};
