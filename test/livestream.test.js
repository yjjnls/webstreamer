const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');
const poll = plugin.utils.poll;

let rtsp_test_server_app,
    livestream_app,
    analyzer_app;
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
    path: '/test_server',
    video_codec: 'h264', // optional
    audio_codec: 'pcma' // optional
};
async function add_livestream() {
    // create livestream
    livestream_app = new plugin.LiveStream("livestream1");
    await livestream_app.initialize();
    // add performer

    await livestream_app.addPerformer(performer_ep);
    // startup app
    await livestream_app.startup();
    // add audience

    await livestream_app.addAudience(audience_ep);
}
async function remove_livestream() {
    await livestream_app.removeAudience(audience_ep.name);
    // stop app
    await livestream_app.stop();
    await livestream_app.terminate();
}
async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
describe('WebStreamer', function () {
    this.timeout(8000);
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
            analyzer_app = new plugin.RTSPAnalyzer("rtsp_test_analyzer", "rtsp://127.0.0.1/test_server");
            await analyzer_app.initialize();
            analyzer_app.on('spectrum', function (data, meta) {
                var obj = JSON.parse(data.toString('utf8'));
                let magnitude = obj.magnitude;
                analyzer_app.calc_band_number(magnitude);
            });
            analyzer_app.on('multifilesink', async function (data, meta) {
                analyzer_app.store_image(data);
            });

        });

        after(async () => {
            await analyzer_app.terminate();
            await analyzer_app.clean();

            await rtsp_test_server_app.stop();
            await rtsp_test_server_app.terminate();

            await plugin.Terminate();
        });

        it(`rtsp analyze`, async () => {
            await add_livestream();
            await sleep(500);
            // analyze
            await analyzer_app.startup();

            try {
                await poll(() => {
                    if ((analyzer_app.audio_passed >= 3) &&
                        (analyzer_app.images.length >= 10))
                        return true;
                    else
                        return false;
                }, 100, 10000);
                console.log('\n===>audio analyze passed!');
                await analyzer_app.stop();

                let image_res = await analyzer_app.analyze_image();
                image_res.forEach((value) => {
                    assert.closeTo(value.time, value.ms, 10, 'ocr recognize time');
                });
                console.log('\n===>video analyze passed!');
            } catch (error) {
                await analyzer_app.stop();
                console.log('~~~~~~~~~~~~~~error~~~~~~~~~~~~~~~~');

                await remove_livestream();
                throw new Error('video analyze failed: ' + error);
            }
            await analyzer_app.stop();

            await remove_livestream();

        });

    });
});

async function test() {
    try {
        await plugin.Initialize({
            rtsp_server: {
                port: 554
            }
        });
    } catch (err) {
        throw new Error(err.toString());
    }
    let rtsp = new plugin.RTSPTestServer("rtsp_test_server");
    await rtsp.initialize();
    await rtsp.startup();
    // await sleep(300000);





    /** ---------------------------------- */

    // create livestream
    let livestream_app = new plugin.LiveStream("livestream1");
    await livestream_app.initialize();
    // add performer
    let performer_ep = {
        name: 'endpoint1',
        protocol: 'rtspclient', // rtspclient/rtspserver
        url: 'rtsp://127.0.0.1/test',
        video_codec: 'h264', // optional
        audio_codec: 'pcma' // optional
    };
    await livestream_app.addPerformer(performer_ep);
    // startup app
    await livestream_app.startup();
    // add audience
    let audience_ep = {
        name: 'endpoint2',
        protocol: 'rtspserver', // rtspclient/rtspserver
        path: '/test_server',
        video_codec: 'h264', // optional
        audio_codec: 'pcma' // optional
    };
    await livestream_app.addAudience(audience_ep);
    // this is very very important
    await sleep(1000);
    // let livestream_app2 = new plugin.LiveStream("livestream2");
    // await livestream_app2.initialize();
    // // add performer
    // let performer_ep2 = {
    //     name: 'endpoint3',
    //     protocol: 'rtspclient', // rtspclient/rtspserver
    //     url: 'rtsp://127.0.0.1/test_server',
    //     video_codec: 'h264', // optional
    //     audio_codec: 'pcma' // optional
    // };
    // await livestream_app2.addPerformer(performer_ep2);
    // // startup app
    // await livestream_app2.startup();
    // // add audience
    // let audience_ep2 = {
    //     name: 'endpoint4',
    //     protocol: 'rtspserver', // rtspclient/rtspserver
    //     path: '/test_server2',
    //     video_codec: 'h264', // optional
    //     audio_codec: 'pcma' // optional
    // };
    // await livestream_app2.addAudience(audience_ep2);
    /**---------------------------analyzer------------------------ */

    let analyzer = new plugin.RTSPAnalyzer("rtsp_test_analyzer", "rtsp://127.0.0.1/test_server");
    analyzer.on('spectrum', function (data, meta) {
        var obj = JSON.parse(data.toString('utf8'));
        let magnitude = obj.magnitude;
        analyzer.calc_band_number(magnitude);
        console.log(analyzer.audio_passed);
    });
    analyzer.on('multifilesink', async function (data, meta) {
        analyzer.store_image(data);
    });
    await analyzer.initialize();
    await analyzer.startup();
    await poll(() => {
        return analyzer.audio_passed >= 3;
    }, 100, 30000);
    console.log('===>audio analyze passed!');
    let image_res = await analyzer.analyze_image();
    image_res.forEach((value) => {
        assert.closeTo(value.time, value.ms, 75, 'ocr recognize time');
    });
    console.log('===>video analyze passed!');
    // await sleep(30000);


    await analyzer.stop();
    await analyzer.terminate();
    await analyzer.clean();
    /**---------------------------analyzer------------------------ */

    await livestream_app.removeAudience(audience_ep.name);
    // stop app
    await livestream_app.stop();
    await livestream_app.terminate();

    /** ---------------------------------- */

    await rtsp.stop();
    await rtsp.terminate();
    await plugin.Terminate();

}

// test();