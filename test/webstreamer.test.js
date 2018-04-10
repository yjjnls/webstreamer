/*jshint esversion: 6 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const webstreamer = require('../index');

async function start_rtsp_server() {
    let rtsp_server = new webstreamer.RTSPTestServer("rtsptest.1");
    await rtsp_server.initialize();
    await rtsp_server.startup();
    return rtsp_server;
}

async function stop_rtsp_server(rtsp_server) {
    await rtsp_server.stop();
}
async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
let spectrum_results = [];
async function start_analyzer() {
    let app = new webstreamer.RTSPTestClient("avanalyzer.1");
    await app.initialize();
    app.on('spectrum', (data) => {
        let obj = JSON.parse(data.toString());
        let magnitude = obj['magnitude'];
        let freq = obj['freq'];
        let sum = 0;
        let target = 0;
        let band = 32000 / 2 / 128;
        for (var i = 0; i < magnitude.length; i++) {
            let mag = Math.pow(10, magnitude[i] / 20);
            sum += mag * mag;
            if (Math.abs(440 - freq[i]) <= (band + 10)) {
                target += mag * mag;
            }
        }
        spectrum_results.push(target / sum);
        // console.log('=====>target: %f', target);
        // console.log('=====>sum: %f', sum);
        // console.log('=====>result: %f', target / sum);
        // console.log(magnitude);
    })
    await app.startup();
    return app;
}
async function stop_analyzer(app) {
    return app.stop();
}
describe('WebStreamer', function () {
    this.timeout(50000);
    before(async () => {
        await webstreamer.Initialize();//plugin intialize()            
    });

    after(async () => {
        await webstreamer.Terminate();
    });

    it(`analyzer`, async () => {
        let rtsp_server = await start_rtsp_server();
        let app = await start_analyzer();
        await sleep(5000);
        await stop_analyzer(app);
        for (var i = 0; i < spectrum_results.length; ++i) {
            expect(spectrum_results[i]).to.be.greaterThan(0.95);
        }

        await stop_rtsp_server(rtsp_server);
    });


});

