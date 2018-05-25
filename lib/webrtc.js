var WebSocketClient = require('websocket').client;
var uuid = require('uuid');


class WebRTC {
    constructor(signal_bridge, connection_id, endpoint_name, app, role, id = uuid.v4()) {
        this.client = new WebSocketClient();
        this.signal_bridge = signal_bridge;
        this.connection_id = connection_id;
        this.endpoint_name = endpoint_name;
        this.app = app;
        this.role = role;
        this.id = id;
        this.connection = null;
        this.closed = false;

        let self = this;
        this.client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
        });

        this.client.on('connect', function (connection) {
            self.connection = connection;
            console.log('WebSocket Client Connected');
            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                console.log('peer connection closed');
                if (!self.closed)
                    self.app.emit('webrtc-peer-closed', self.endpoint_name);
            });
            connection.on('message', function (message) {
                // console.log("Received: '" + message.utf8Data + "'");
                if (message.utf8Data == 'HELLO') {
                    if (self.role == 'offer')
                        connection.send('SESSION ' + self.connection_id);
                } else if (message.utf8Data == 'SESSION_OK') {
                    // start_pipeline();
                } else {
                    try {
                        let obj = JSON.parse(message.utf8Data);
                        if (obj.sdp) {
                            // let type = obj.sdp.type;
                            // let sdp_str = obj.sdp.sdp;
                            self.app.call('remote_sdp',
                                {
                                    "name": self.endpoint_name,
                                    "type": obj.sdp.type,
                                    "sdp": obj.sdp.sdp
                                })
                                .then(() => {
                                    // console.log('set remote sdp');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                        if (obj.ice) {
                            // let candidate = obj.ice.candidate;
                            // let sdpMLineIndex = obj.ice.sdpMLineIndex;

                            self.app.call('remote_candidate',
                                {
                                    "name": self.endpoint_name,
                                    "candidate": obj.ice.candidate,
                                    "sdpMLineIndex": obj.ice.sdpMLineIndex
                                })
                                .then(() => {
                                    // console.log('set remote candidate');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
            connection.send('HELLO ' + self.id);
        });

        this.app.on('webrtc', (data, meta) => {
            let obj = JSON.parse(meta);
            if (obj.type == 'sdp') {
                // console.log(JSON.parse(data.toString()))
                let text = JSON.stringify({ "sdp": JSON.parse(data.toString()) });
                // console.log('======2')
                console.log(text);
                // console.log('======3')
                self.connection.send(text);
            }
            if (obj.type == 'ice') {
                // console.log(data)
                let text = JSON.stringify({ "ice": JSON.parse(data.toString()) });

                self.connection.send(text);
            }
        });
    }

    connect() {
        this.client.connect(this.signal_bridge);
    }
    close() {
        this.connection.close();
    }
}

module.exports = {
    WebRTC
};