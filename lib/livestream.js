/* jshint esversion:6 */
var IApp = require('./app').IProcessor;

class LiveStream extends IApp {

    constructor(webstreamer, name) {
        super(webstreamer, name, 'LiveStream');
        this.type = 'LiveStream';
        this.name = name;
        this.webstreamer = webstreamer;
        this.performer = null;
        this.audiences = [];
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
        if (!endpoint.protocol || !endpoint.name || !endpoint.path) {
            this.reject(`Endpoint with invalid parameters!`);
            return;
        }
        for (var i = 0; i < this.audiences.length; ++i) {
            if (this.audiences[i].name == endpoint.name) {
                this.reject(`Audiences has been added!`);
                return;
            }
        }
        return this.call('add_audience', endpoint)
            .then(() => {
                this.audiences.push(endpoint);
            })
            .catch((err) => {
                this.reject(`Add audience failed! ${err}`);
            });
    }
    removeAudience(endpoint_name) {
        for (var i = 0; i < this.audiences.length; ++i) {
            if (this.audiences[i].name == endpoint_name) {
                break;
            }
        }
        if (i >= this.audiences.length) {
            this.reject(`Audience not found!`);
            return;
        }


        var self = this;
        return this.call('remove_audience', self.audiences[i])
            .then(() => {
                let index = self.audiences.indexOf(self.audiences[i]);
                self.audiences.splice(index, 1);
            })
            .catch((err) => {
                this.reject(`Remove audience failed! ${err}`);
            });
    }
}

module.exports = {
    LiveStream: LiveStream,
};