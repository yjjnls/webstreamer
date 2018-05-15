const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');
const poll = plugin.utils.poll;

let rtsp_test_server_app,
    livestream_app,
    rtsp_analyzer_app,
    webrtc_analyzer_app;
let performer_ep = {
    name: 'endpoint1',
    protocol: 'rtspclient', // rtspclient/rtspserver
    url: 'rtsp://127.0.0.1/test',
    video_codec: 'h264', // optional
    audio_codec: 'pcma' // optional
};
let audience_ep = {
    name: 'endpoint2',
    protocol: 'rtspserver', // rtspclient/rtspserver
    path: '/test_server'
};
let audience_ep_webrtc = {
    name: 'endpoint3',
    protocol: 'webrtc', // rtspclient/rtspserver
    signal_bridge: 'http://localhost:3030/livestream.webrtc',
    connection_id: '1111'
};
async function add_livestream() {
    // create livestream
    livestream_app = new plugin.LiveStream("livestream1");
    await livestream_app.initialize();
    // add performer

    await livestream_app.addPerformer(performer_ep);
    // startup app
    await livestream_app.startup();

}
async function remove_livestream() {
    // stop app
    await livestream_app.stop();
    await livestream_app.terminate();
}

async function init_rtsp_analyzer() {
    rtsp_analyzer_app = new plugin.RTSPAnalyzer("rtsp_test_analyzer", "rtsp://127.0.0.1/test_server");
    await rtsp_analyzer_app.initialize();
    rtsp_analyzer_app.on('spectrum', function (data, meta) {
        var obj = JSON.parse(data.toString('utf8'));
        let magnitude = obj.magnitude;
        rtsp_analyzer_app.calc_band_number(magnitude);
    });
    rtsp_analyzer_app.on('multifilesink', async function (data, meta) {
        rtsp_analyzer_app.store_image(data);
    });
}

async function init_webrtc_analyzer() {
    webrtc_analyzer_app = new plugin.WebRTCAnalyzer("webrtc_test_analyzer", audience_ep_webrtc.signal_bridge, audience_ep_webrtc.connection_id);
    await webrtc_analyzer_app.initialize();
    webrtc_analyzer_app.on('spectrum', function (data, meta) {
        var obj = JSON.parse(data.toString('utf8'));
        let magnitude = obj.magnitude;
        webrtc_analyzer_app.calc_band_number(magnitude);
    });
    webrtc_analyzer_app.on('multifilesink', async function (data, meta) {
        webrtc_analyzer_app.store_image(data);
    });
}
async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
describe('WebStreamer', function () {
    this.timeout(30000);
    describe('livestream', function () {
        before(async () => {
            // initialize plugin
            try {
                await plugin.Initialize({
                    rtsp_server: {
                        port: 554
                    }
                });
            } catch (err) {
                throw new Error(err.toString());
            }
            // initialize rtsp test server app
            rtsp_test_server_app = new plugin.RTSPTestServer("rtsp_test_server");
            await rtsp_test_server_app.initialize();
            await rtsp_test_server_app.startup();
            // initialize analyzer app
            await add_livestream();

        });

        after(async () => {
            await remove_livestream();

            await rtsp_test_server_app.stop();
            await rtsp_test_server_app.terminate();

            await plugin.Terminate();
        });

        it.skip(`rtsp analyze`, async () => {
            await init_rtsp_analyzer();
            // add audience(rtsp)
            await livestream_app.addAudience(audience_ep);
            await sleep(500);
            // analyze
            await rtsp_analyzer_app.startup();

            try {
                await poll(() => {
                    if ((rtsp_analyzer_app.audio_passed >= 3) &&
                        (rtsp_analyzer_app.images.length >= 10))
                        return true;
                    else
                        return false;
                }, 100, 10000);
                console.log('\n===>audio analyze passed!');
                await rtsp_analyzer_app.stop();

                let image_res = await rtsp_analyzer_app.analyze_image();
                image_res.forEach((value) => {
                    assert.closeTo(value.time, value.ms, 10, 'ocr recognize time');
                });
                console.log('\n===>video analyze passed!');
            } catch (error) {
                await rtsp_analyzer_app.stop();
                console.log('~~~~~~~~~~~~~~error~~~~~~~~~~~~~~~~');

                await remove_livestream();
                throw new Error('video analyze failed: ' + error);
            }
            await livestream_app.removeAudience(audience_ep.name);

            await rtsp_analyzer_app.terminate();
            await rtsp_analyzer_app.clean();

        });
        it(`webrtc analyze`, async () => {
            await init_webrtc_analyzer();

            // add audience(webrtc)
            await webrtc_analyzer_app.startup();
            await sleep(1000);
            await livestream_app.addAudience(audience_ep_webrtc);
            // await sleep(50000);

            try {
                await poll(() => {
                    if ((webrtc_analyzer_app.audio_passed >= 3) &&
                        (webrtc_analyzer_app.images.length >= 10))
                        return true;
                    else
                        return false;
                }, 100, 10000);
                console.log('\n===>audio analyze passed!');
                await webrtc_analyzer_app.stop();

                let image_res = await webrtc_analyzer_app.analyze_image();
                image_res.forEach((value) => {
                    assert.closeTo(value.time, value.ms, 10, 'ocr recognize time');
                });
                console.log('\n===>video analyze passed!');
            } catch (error) {
                await webrtc_analyzer_app.stop();
                console.log('~~~~~~~~~~~~~~error~~~~~~~~~~~~~~~~\n' + error);

                await remove_livestream();
                throw new Error('video analyze failed: ' + error);
            }
            // it's not necessary here, when the analyzer stop, it will automaticlly deteced and remove the
            await livestream_app.removeAudience(audience_ep_webrtc.name);

            await webrtc_analyzer_app.terminate();
            await webrtc_analyzer_app.clean();

        });

        it.skip(`webrtc to web`, async () => {

            // add audience(webrtc)
            await sleep(1000);
            let ep = audience_ep_webrtc;
            ep.connection_id = 1234; // for web
            await livestream_app.addAudience(ep);
            await sleep(20000);

            await livestream_app.removeAudience(audience_ep_webrtc.name);
        });

    });
});
