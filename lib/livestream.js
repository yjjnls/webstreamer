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
            .then((res) => {
                this.performer = endpoint;
            })
            .catch((err) => {
                this.reject(`Add performer failed!`);
            });
    }
    // removePerformer(endpoint_name) {
    //     if (this.performer == null) {
    //         this.reject(`There's no performer!`);
    //     }
    //     if (this.performer.name != endpoint_name) {
    //         this.reject(`${endpoint_name} is not in the LiveStream!`);
    //     }
    // }
    addAudience(endpoint) {

    }
    removeAudience(endpoint_name) {

    }
}

module.exports = {
    LiveStream: LiveStream,
};