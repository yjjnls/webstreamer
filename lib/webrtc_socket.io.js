/**
 * Created by Ganchao on 2018/5/10.
 */
const socket = require('socket.io-client');
const uuid = require('uuid');


class WebRTC {
    constructor(signal_bridge, room_id, endpoint_name, app, id = uuid.v4()) {

        this.signal_bridge = signal_bridge;
        this.room_id = room_id;
        this.endpoint_name = endpoint_name;
        this.app = app;
        this.id = id;
        this.connection = null;
        this.closed = false;
        this.io = null;

        this.app.on('webrtc', (data, meta) => {
            let obj = JSON.parse(meta);
            if (obj.type === 'sdp') {
                if(this.io) {
                    this.io.emit('sdp', JSON.parse(data));
                }

            }
            if (obj.type === 'ice') {
                if(this.io) {
                    this.io.emit('sdp', JSON.parse(data));
                }

            }
        });
    }

    handleSdp(data) {
        this.app.call('remote_sdp', {
            name : this.endpoint_name,
            type : data.type,
            sdp : data.sdp
        })
            .catch(err => {
                throw err;
            });
    }

    handleCandidate(data) {
        this.app.call('remote_candidate', {
            name : this.endpoint_name,
            candidate : data.candidate,
            sdpMLineIndex : data.sdpMLineIndex
        })
            .catch(err => {
                throw err;
            });
    }

    onSocketMessage(msgObj) {
        let topic, data;

        topic = msgObj.topic;
        data = msgObj.data;

        if(topic === 'sdp' && data !== undefined) {
            switch(data.type) {
                case 'offer':
                case 'answer':
                    this.handleSdp(data);
                    break;
                default:
                    break;
            }
            if(data.candidate) {
                this.handleCandidate(data);
            }
        }
    }

    connect() {
        this.io = socket(`${this.signal_bridge}?room=${this.room_id}`, { forceNew: true });

        let io = this.io;

        const onConnect = () => {
            //subscribe sdp
            io.on('sdp', (data) => {
                this.onSocketMessage({
                    topic: 'sdp',
                    data: data
                });
            });
        };

        io.on('connect', onConnect);
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
        io.on('connect_error', (error ) => {
            this.close();
            throw error;
        });
    }

    close() {
        if(this.io) {
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
