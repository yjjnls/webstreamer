/* jshint esversion:6 */
var IApp = require('./app').IProcessor;
// var WebRTC = require('./webrtc_socket.io.js').WebRTC;
var WebRTC = require('./webrtc.js').WebRTC;

class LiveStream extends IApp {

    constructor(webstreamer, name) {
        super(webstreamer, name, 'LiveStream');
        this.type = 'LiveStream';
        this.name = name;
        this.webstreamer = webstreamer;
        this.performer = null;
        this.audiences = [];
        this.webrtcs = {}; // {uuid:webrtc}
        let self = this;
        this.on('webrtc-peer-closed', (endpoint_name) => {
            console.log(endpoint_name + ' closed and removed automatically.');
            self.removeAudience(endpoint_name, self);
        });
    }
    startup() {
        return this.call('startup');
    }


    stop() {
        return this.call('stop');
    }
    // endpoint = {
    //     name: 'endpoint1',
    //     protocol: 'rtspclient',
    //     url: 'rtsp://172.16.66.65/id=1',
    //     video_codec: 'h264',
    //     audio_codec: 'pcma'
    // }
    addPerformer(endpoint) {
        if (endpoint.protocol != 'rtspclient') {
            this.reject(`It's not a performer endpoint!`);
            return;
        }
        if (this.performer != null) {
            this.reject(`There's already a performer now!`);
            return;
        }
        if (!endpoint.url || (!endpoint.video_codec && !endpoint.audio_codec)) {
            this.reject(`The information of the endpoint is not completed!`);
            return;
        }

        return this.call('add_performer', endpoint)
            .then(() => {
                this.performer = endpoint;
            })
            .catch((err) => {
                this.reject(`Add performer failed! ${err}`);
            });
    }

    addAudience(endpoint) {
        if (this.performer == null) {
            this.reject(`There's no performer, add one first!`);
            return;
        }
        if (!endpoint.protocol || !endpoint.name) {
            this.reject(`Endpoint with invalid parameters!`);
            return;
        }
        for (var i = 0; i < this.audiences.length; ++i) {
            if (this.audiences[i].name == endpoint.name) {
                this.reject(`Audiences has been added!`);
                return;
            }
        }
        let webrtc;
        if (endpoint.protocol == 'webrtc') {
            // console.log(endpoint.connection_id)
            if (endpoint.role == 'offer') {
                webrtc = new WebRTC(endpoint.signal_bridge, endpoint.connection_id, endpoint.name, this, 'offer');
            } else if (endpoint.role == 'answer') {
                webrtc = new WebRTC(endpoint.signal_bridge, null, endpoint.name, this, 'answer', endpoint.connection_id);
            } else {
                this.reject(`The endpoint is neither offer nor answer!`);
                return;
            }
            webrtc.connect();
            endpoint.ws_id = webrtc.id;
        }
        let self = this;

        return this.call('add_audience', endpoint)
            .then(() => {
                self.audiences.push(endpoint);

                if (webrtc) {
                    self.webrtcs[endpoint.ws_id] = webrtc;
                    // console.log('add: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
                }
            })
            .catch((err) => {
                self.reject(`Add audience failed! ${err}`);
            });
    }
    removeAudience(endpoint_name, self = this) {
        for (var i = 0; i < self.audiences.length; ++i) {
            if (self.audiences[i].name == endpoint_name) {
                break;
            }
        }
        if (i >= self.audiences.length) {
            return 'Audience not found or has been removed!';
        }
        // console.log('remove: audience left: ' + self.audiences.length);
        let audience = self.audiences[i];
        let index = self.audiences.indexOf(self.audiences[i]);
        self.audiences.splice(index, 1);
        // console.log('remove: audience left: ' + self.audiences.length);

        if (audience.protocol == 'webrtc') {
            // console.log('remove: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
            if (self.webrtcs[audience.ws_id]) {
                self.webrtcs[audience.ws_id].closed = true;
                self.webrtcs[audience.ws_id].close();
                delete self.webrtcs[audience.ws_id];
            }
            // console.log('remove: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
        }

        return self.call('remove_audience', audience)
            .then(() => {
                return 'remove audience successfully!';
            })
            .catch((err) => {
                self.reject(`Remove audience failed! ${err}`);
            });
    }
}

module.exports = {
    LiveStream: LiveStream
};