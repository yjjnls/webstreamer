/* jshint esversion:6 */
var IApp = require('./app').IProcessor;
var WebRTC = require('./webrtc_socket.io.js').WebRTC;
// var WebRTC = require('./webrtc.js').WebRTC;

class MultiPoints extends IApp {

    constructor(webstreamer, name) {
        super(webstreamer, name, 'MultiPoints');
        this.type = 'MultiPoints';
        this.name = name;
        this.webstreamer = webstreamer;
        this.speaker = null;
        this.members = [];
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
        for (var i = 0; i < this.members.length; ++i) {
            let member = this.members[i];
            if (this.webrtcs[member.ws_id]) {
                this.webrtcs[member.ws_id].closed = true;
                this.webrtcs[member.ws_id].close();
                delete this.webrtcs[member.ws_id];
            }
        }
        return this.call('stop');
    }
    // endpoint = {
    //     name: 'endpoint1',
    //     protocol: 'rtspclient',
    //     url: 'rtsp://172.16.66.65/id=1',
    //     video_codec: 'h264',
    //     audio_codec: 'pcma'
    // }
    setSpeaker(endpoint) {
        if (!endpoint.name) {
            this.reject(`The information of the endpoint is not completed!`);
            return;
        }

        return this.call('set_speaker', endpoint)
            .then(() => {
                this.speaker = endpoint;
            })
            .catch((err) => {
                this.reject(`Add speaker failed! ${err}`);
            });
    }
    // endpoint = {
    //     name: 'endpoint1',
    //     connection_id: 2,
    //     protocol: 'rtspclient',
    //     signal_bridge: 'http://172.16.64.58:9001/',
    //     video_codec: 'h264',
    //     audio_codec: 'pcma'
    // }
    addMember(endpoint) {
        if (!endpoint.protocol || !endpoint.name || !endpoint.connection_id) {
            this.reject(`Endpoint with invalid parameters!`);
            return;
        }
        for (var i = 0; i < this.members.length; ++i) {
            if (this.members[i].name == endpoint.name) {
                this.reject(`Members has been added!`);
                return;
            }
        }
        let webrtc;
        if (endpoint.protocol == 'webrtc') {
            // console.log(endpoint.connection_id)
            webrtc = new WebRTC(endpoint.signal_bridge, endpoint.connection_id, endpoint.name, this);
        } else {
            this.reject(`The endpoint is neither offer nor answer!`);
            return;
        }
        webrtc.connect();
        endpoint.ws_id = webrtc.id;
        let self = this;

        return this.call('add_member', endpoint)
            .then(() => {
                self.members.push(endpoint);

                if (webrtc) {
                    self.webrtcs[endpoint.ws_id] = webrtc;
                    // console.log('add: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
                }
            })
            .catch((err) => {
                self.reject(`Add member failed! ${err}`);
            });
    }
    removeMember(endpoint_name, self = this) {
        for (var i = 0; i < self.members.length; ++i) {
            if (self.members[i].name == endpoint_name) {
                break;
            }
        }
        if (i >= self.members.length) {
            return 'Member not found or has been removed!';
        }
        // console.log('remove: member left: ' + self.members.length);
        let member = self.members[i];
        let index = self.members.indexOf(self.members[i]);
        self.members.splice(index, 1);
        // console.log('remove: member left: ' + self.members.length);

        if (member.protocol == 'webrtc') {
            // console.log('remove: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
            if (self.webrtcs[member.ws_id]) {
                self.webrtcs[member.ws_id].closed = true;
                self.webrtcs[member.ws_id].close();
                delete self.webrtcs[member.ws_id];
            }
            // console.log('remove: webrtcs left: ' + Object.getOwnPropertyNames(self.webrtcs).length);
        }

        return self.call('remove_member', member)
            .then(() => {
                return 'remove member successfully!';
            })
            .catch((err) => {
                self.reject(`Remove member failed! ${err}`);
            });
    }
}

module.exports = {
    MultiPoints: MultiPoints
};