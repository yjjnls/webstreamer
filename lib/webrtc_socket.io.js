const socket = require('socket.io-client');
const uuid = require('uuid');

class WebRTC {
    constructor(signal_bridge, connection_id, endpoint_name, app, id = uuid.v4()) {

        this.signal_bridge = signal_bridge;
        this.connection_id = connection_id;
        this.endpoint_name = endpoint_name;
        this.app = app;
        this.id = id;
        this.connection = null;
        this.closed = false;
        this.io = null;
        this.socketMessageEvent = 'video-conference-demo';
        this.remote_user_id = '';
        this.remote_user_set = false;
        this.send_data = [];
        this.negoated = false;

        this.join_msg1 = {
            "remoteUserId": "",
            "message": {
                "enableMedia": true,
                "userPreferences": {
                    "extra": {},
                    "localPeerSdpConstraints": {
                        "OfferToReceiveAudio": true,
                        "OfferToReceiveVideo": true
                    },
                    "remotePeerSdpConstraints": {
                        "OfferToReceiveAudio": true,
                        "OfferToReceiveVideo": true
                    },
                    "isOneWay": true,
                    "isDataOnly": false,
                    "dontGetRemoteStream": false,
                    "dontAttachLocalStream": false,
                    "connectionDescription": {
                    }
                }
            },
            "sender": this.connection_id
        };
        this.join_msg2 = {
            "remoteUserId": "",
            "message": "next-possible-initiator",
            "sender": this.connection_id
        };
        let self = this;
        // If we only listen on the 'webrtc' signal, it occurs error when multipoints app create more tha one WebRTC instance.
        // Every instance will listen on the same signal 'webrtc', and notification from signal one webrc instance(c++) will triggle all instance(js) to do the logic.
        this.app.on('webrtc@' + this.endpoint_name, (data, meta) => {
            let obj = JSON.parse(meta);
            if (obj.type === 'sdp') {
                // console.log(JSON.parse(data.toString()).sdp)
                if (self.io) {
                    let json_data = {
                        "remoteUserId": this.remote_user_id,
                        "message": {
                            "type": "offer",
                            "sdp": JSON.parse(data.toString()).sdp,
                            "remotePeerSdpConstraints": {
                                "OfferToReceiveAudio": true,
                                "OfferToReceiveVideo": true
                            },
                            "renegotiatingPeer": false,
                            "connectionDescription": {
                                "remoteUserId": this.connection_id,
                                "message": {
                                    "newParticipationRequest": true,
                                    "isOneWay": false,
                                    "isDataOnly": false,
                                    "localPeerSdpConstraints": {
                                        "OfferToReceiveAudio": true,
                                        "OfferToReceiveVideo": true
                                    },
                                    "remotePeerSdpConstraints": {
                                        "OfferToReceiveAudio": true,
                                        "OfferToReceiveVideo": true
                                    }
                                },
                                "sender": this.remote_user_id,
                                "password": false
                            },
                            "dontGetRemoteStream": false,
                            "extra": {},
                            "streamsToShare": {
                                "z6aPx6SM7MqCxclAa3gzy9xNZLsRWnu9SvMl": {
                                    "isAudio": false,
                                    "isVideo": true,
                                    "isScreen": false
                                }
                            }
                        },
                        "sender": this.connection_id
                    }
                    if (!self.negoated)
                        self.send_data.push(json_data);
                    else
                        self.io.emit(self.socketMessageEvent, json_data);
                }

            }
            if (obj.type === 'ice') {
                if (self.io) {
                    let ice = JSON.parse(data.toString());
                    let json_data = {
                        "remoteUserId": self.remote_user_id,
                        "message": ice,
                        "sender": self.connection_id
                    }
                    if (!self.negoated)
                        self.send_data.push(json_data);
                    else
                        self.io.emit(self.socketMessageEvent, json_data);
                }
            }
        });
    }

    handleSdp(data) {
        this.app.call('remote_sdp', {
            name: this.endpoint_name,
            type: data.type,
            sdp: data.sdp
        })
            .catch(err => {
                throw err;
            });
    }

    handleCandidate(data) {
        this.app.call('remote_candidate', {
            name: this.endpoint_name,
            candidate: data.candidate,
            sdpMLineIndex: data.sdpMLineIndex
        })
            .catch(err => {
                throw err;
            });
    }
    connect() {
        this.io = socket(`${this.signal_bridge}?userid=${this.connection_id}&sessionid=${this.connection_id}&msgEvent=${this.socketMessageEvent}&socketCustomEvent=RTCMultiConnection-Custom-Message&autoCloseEntireSession=false&maxParticipantsAllowed=1000`);

        let io = this.io;
        let self = this;
        io.on('connect', (socket) => {
            // io.emit('extra-data-updated', {});

            // io.emit(this.socketMessageEvent, this.join_msg1);

            // io.emit(this.socketMessageEvent, this.join_msg2);
            let self = this;

            io.on(this.socketMessageEvent, (data) => {
                // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                // console.log(data)
                let msg = data.message;
                if (!self.remote_user_set && data.hasOwnProperty('sender')) {
                    self.remote_user_set = true;
                    self.remote_user_id = data.sender;
                    self.join_msg1.remoteUserId = data.sender;
                    self.join_msg1.message.userPreferences.connectionDescription = data;
                    self.join_msg2.remoteUserId = data.sender;

                    io.emit(self.socketMessageEvent, self.join_msg1);

                    // io.emit(self.socketMessageEvent, self.join_msg2);
                    // if (msg.hasOwnProperty('sdp')) {
                    //     self.handleSdp(msg);
                    // }
                    // if (msg.hasOwnProperty('candidate')) {
                    //     self.handleCandidate(msg);
                    // }
                    // self.send_data.forEach((data) => {
                    //     data.remoteUserId = self.remote_user_id;
                    //     self.io.emit(self.socketMessageEvent, data);
                    // })
                }
                if (!!data.message.userPreferences &&
                    !!data.message.userPreferences.streamsToShare) {
                    io.emit(self.socketMessageEvent, self.join_msg2);

                    self.send_data.forEach((data) => {
                        data.remoteUserId = self.remote_user_id;
                        self.io.emit(self.socketMessageEvent, data);
                    })
                    self.send_data = []
                    self.negoated = true;
                }
                if (self.negoated && msg.hasOwnProperty('sdp')) {
                    self.handleSdp(msg);
                }
                if (self.negoated && msg.hasOwnProperty('candidate')) {
                    self.handleCandidate(msg);
                }
            });
        });
        io.on('disconnect', (reason) => {
            console.log('webrtc socket.io disconnect: ' + reason);
            this.close();
        });
        io.on('leave', (reason) => {
            console.log(reason);
            this.close();
        });
        io.on('reconnect_failed', () => {
            this.close();
            throw Error('reconnect_failed');
        });
        io.on('connect_timeout', () => {
            io.open();
        });
        io.on('connect_error', (error) => {
            this.close();
            throw error;
        });
    }

    close() {
        if (this.io) {
            this.io.close();
            this.io = null;
        }
        if (!this.closed) {
            this.closed = true;
            this.app.emit('webrtc-peer-closed', this.endpoint_name);
        }

    }
}

module.exports = {
    WebRTC
};


// let webrtc = new WebRTC('http://localhost:9001/', 2, 'nodejs_socket.io', null);
// webrtc.connect();