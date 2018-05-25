const IElementWatcher = require('./elementwatcher').IElementWatcher;
const CodecMap = require('./codecmap').TABLE;

let rmdirSync = require('./utils').rmdirSync;
let parseTime = require('./utils').parseTime;

const tesseract = require('node-tesseract');
const Promise = require('bluebird');
const uuid = require('uuid');
const fs = require('fs');
// var WebRTC = require('./webrtc_socket.io.js').WebRTC;
var WebRTC = require('./webrtc.js').WebRTC;

const Tesseract = require('./tesseract.js').Tesseract;

async function ocr(filename) {

    let options = {
        psm: 7,
        config: 'time'
    };

    return new Promise(function (resolve, reject) {
        tesseract.process(filename, options, function (err, text) {
            if (err) {
                reject(err);
            } else {

                let strtime = text.replace(/[\r\n\f]/g, "");
                // console.log(text)
                // console.log('---------------')
                // console.log(strtime)
                strtime = strtime.replace(/[,]/g, ".");
                console.log(strtime);
                let ms = parseTime(strtime);
                if (ms == null) {
                    reject("invalide time format:" + strtime);
                } else {
                    resolve(ms);
                }
            }
        });
    });
}

class Analyzer extends IElementWatcher {
    constructor(webstreamer, name, url, option) {
        super(webstreamer, name);
        this.option = option;
        this.url = url;
        this.audio_passed = 0;
        this.video_frame = 10;
        this.image_base_number = 5; // invalid image number
        this.image_number = 4; // valid number
        this.images = [];
        this.out_dir = 'img@' + uuid.v4();

        this.option.image.location = `${this.out_dir}/%05d.jpg`;
        // fs.mkdirSync(this.out_dir);
        this.launch = null;
        this.tesseract_plugin = new Tesseract();
        let self = this;
        this.tesseract_plugin.on('image_data', async function (data, meta) {
            let obj = JSON.parse(data.toString('utf8'));
            let ocr_time = parseTime(obj.ocr);
            let ms = obj["stream-time"] / 1000000;
            self.images.push({ "time": ocr_time, "ms": ms });
            // console.log({ "time": ocr_time, "ms": ms });
        });
    }

    async startup() {
        await this.tesseract_plugin.initialize();
        return this.call('startup', {
            frame: this.video_frame,
            launch: this.launch
        });
    }

    async stop() {
        await this.tesseract_plugin.terminate();
        this.tesseract_plugin = null;
        await this.call('stop');
    }
    clean() {
        if (this.out_dir) {
            if (fs.existsSync(this.out_dir)) {
                rmdirSync(this.out_dir);
            }
            this.out_dir = null;
        }
    }

    calc_band_number(magnitude) {
        let freq = this.option.audio.freq;
        let bands = this.option.audio.bands;
        let rate = this.option.audio.rate;

        let bandwith = (rate / bands) / 2;
        let pos = freq / bandwith;
        pos = Math.max(pos, 0);
        pos = Math.round(pos);
        let max = Math.max.apply(null, magnitude);
        let mag = magnitude[pos];

        if (Math.abs(mag - max) < 5) {
            this.audio_passed++;
        }
    }

    store_image(data) {
        // if (this.images.length > (this.image_number + this.image_base_number))
        //     return;
        let j = JSON.parse(data.toString('utf8'));
        let filename = j.filename;
        let time = j["stream-time"] / 1000000;
        this.images.push({ "filename": filename, "time": time });
    }

    async analyze_image() {
        // console.log('start analyze_image')
        let res = [];
        let pre1, pre2;
        for (let i = 0; i < this.image_base_number + this.image_number; i++) {
            if (i < this.image_base_number)
                continue;
            // let filename = this.images[i].filename;
            let time = this.images[i].time;
            let ms = this.images[i].ms;
            if (i == this.image_base_number) {
                pre1 = time;
                pre2 = ms;
            } else {

                res.push({ 'time': time - pre1, 'ms': ms - pre2 });
                pre1 = time;
                pre2 = ms;
            }
        }
        console.log(res);
        // console.log('end analyze_image')

        return res;
    }

    video_analyze(data, meta) {
        return this.tesseract_plugin.call(data, meta);
    }
}

class RTSPAnalyzer extends Analyzer {
    constructor(webstreamer, name, url, option) {
        super(webstreamer, name, url, option);
        let video = this.option.video;
        let audio = this.option.audio;

        let video_codec = CodecMap[video.codec];
        let audio_codec = CodecMap[audio.codec];
        // this.launch =
        //     `( rtspsrc location=${this.url} name=r r. `
        //     + `! queue ! capsfilter caps="application/x-rtp,media=video" `
        //     // + `! ${video_codec.depay} ! ${video_codec.dec} ! autovideosink sync=false r. `
        //     + `! ${video_codec.depay} ! ${video_codec.dec} `
        //     + `! jpegenc ! multifilesink name=image post-messages=TRUE location=${this.option.image.location} r. `
        //     + `! queue ! capsfilter caps="application/x-rtp,media=audio" ` // audio
        //     + `! ${audio_codec.depay} ! ${audio_codec.dec} ! audioconvert `
        //     + `! spectrum name=audio bands=${audio.bands} threshold=${audio.threshold} post-messages=TRUE message-phase=TRUE message-magnitude=TRUE `
        //     + `! fakesink )`;
        // // + `! spectrascope ! autovideosink sync=false )`;
        // // this.launch=`rtspsrc location=rtsp://127.0.0.1/test_server ! rtph264depay ! avdec_h264 ! autovideosink sync=false`;

        this.launch =
            `( rtspsrc location=${this.url} name=r r. `
            + `! queue ! capsfilter caps="application/x-rtp,media=video" `
            + `! ${video_codec.depay} ! ${video_codec.dec} ! fakesink name=sink r. `
            + `! queue ! capsfilter caps="application/x-rtp,media=audio" ` // audio
            + `! ${audio_codec.depay} ! ${audio_codec.dec} ! audioconvert `
            + `! spectrum name=audio bands=${audio.bands} threshold=${audio.threshold} post-messages=TRUE message-phase=TRUE message-magnitude=TRUE `
            + `! fakesink )`;
    }
}

class WebRTCAnalyzer extends Analyzer {
    constructor(webstreamer, name, signal_bridge, id, option, role = 'answer') {
        super(webstreamer, name, null, option);
        this.id = id;
        this.signal_bridge = signal_bridge;
        this.type = 'WebRTCTestClient';
        this.role = role;

        let video = this.option.video;
        let audio = this.option.audio;

        let video_codec = CodecMap[video.codec];
        let audio_codec = CodecMap[audio.codec];
        this.launch =
            `( webrtcbin name=webrtc `
            + ` webrtc.! ${video_codec.depay} name=video_payloader ! ${video_codec.dec} ! fakesink name=sink`
            // + `! jpegenc ! multifilesink name=image post-messages=TRUE location=${this.option.image.location}`
            + ` webrtc. ! ${audio_codec.depay} ! ${audio_codec.dec} ! audioconvert ! audioresample `
            + `! spectrum name=audio bands=${audio.bands} threshold=${audio.threshold} post-messages=TRUE message-phase=TRUE message-magnitude=TRUE `
            + `! fakesink )`;

        // this.launch =
        //     `( webrtcbin name=webrtc `
        //     + ` webrtc.! ${video_codec.depay} name=video_payloader ! ${video_codec.dec} `
        //     + `! autovideosink sync=false`
        //     + ` webrtc. ! ${audio_codec.depay} ! ${audio_codec.dec} ! audioconvert ! audioresample `
        //     // + `! autoaudiosink sync=false )`;
        //     + `! spectrascope ! autovideosink sync=false )`;


        // this.launch =
        //     `( webrtcbin name=webrtc `
        //     + ` videotestsrc pattern=ball ! x264enc ! rtph264pay ! queue ! application/x-rtp,media=video,payload=96,encoding-name=H264 ! webrtc. `
        //     + ` audiotestsrc wave=saw ! alawenc ! rtppcmapay ! queue ! application/x-rtp,media=audio,payload=8,encoding-name=PCMA ! webrtc. `
        //     + ` )`;
    }
    async startup() {
        if (this.role == 'answer') {
            this.webrtc = new WebRTC(this.signal_bridge, null, null, this, 'answer', this.id);
        } else {
            this.webrtc = new WebRTC(this.signal_bridge, this.id, null, this, 'offer', null);
        }
        this.webrtc.connect();
        await this.tesseract_plugin.initialize();

        return this.call('startup', {
            role: this.role,
            launch: this.launch
        });
    }
    async stop() {

        this.webrtc.close();
        this.webrtc = null;
        await super.stop();
    }
}


module.exports = {
    RTSPAnalyzer,
    WebRTCAnalyzer
};
