
/*jshint esversion: 6 */

const webstreamer = require('./index');

async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}

async function main_rtsp_server() {


    console.log("processing");
    let rtsp = new webstreamer.RTSPTestServer("rtsptest.1");
    //rtsp.option.video.overlay['draw-shadow'] = false
    //rtsp.option.video.overlay['draw-outline'] = false
    await rtsp.initialize();

    await rtsp.startup();



    //await sleep(15*1000)
    console.log("to end");

    await rtsp.stop()


    console.log("end");
    return;


}

const RTSPTestClient = require('./lib/rtsptestclient').RTSPTestClient;
async function main_analyzer() {
    let app = new webstreamer.RTSPTestClient("avanalyzer.1");

    await app.initialize();
    await app.startup();
    app.on('spectrum', (data) => {
        let obj = JSON.parse(data.toString());
        let magnitude = obj['magnitude'];
        let freq = obj['freq'];
        let sum = 0;
        let target = 0;
        let band = 32000 / 2 / 128;
        for (var i = 0; i < magnitude.length; i++) {
            // console.log(magnitude[i]);
            let mag = Math.pow(10, magnitude[i] / 20);
            sum += mag * mag;
            if (Math.abs(440 - freq[i]) <= (band + 10)) {
                console.log(freq[i])
                target += mag * mag;
            }
        }
        console.log('=====>target: %f', target);
        console.log('=====>sum: %f', sum);
        console.log('=====>result: %f', target / sum);
        // console.log(magnitude);
    })



    //await sleep(15*1000)
    //console.log("to end")
    //
    ////await rtsp.stop()
    //
    //
    //console.log("end")
    return;


}
async function main() {
    console.log("+ libwebstreamer.Initialize()");
    await webstreamer.Initialize();//plugin intialize()
    console.log("- libwebstreamer.Initialize()");
    await webstreamer.Terminate();
    await sleep(1000);
    console.log('~~~~~~1~~~~')

    await webstreamer.Initialize();//plugin intialize()
    console.log('~~~~~~2~~~~')
    await webstreamer.Terminate();
    console.log('~~~~~~3~~~~')
    // return main_analyzer()
    //return main_rtsp_server()   
    // await main_rtsp_server();
    // await main_analyzer();
}
main().then(value => {
    console.log("success:", value);
}).catch(err => {
    console.log("fail:", err.message.toString('utf8'));
})
console.log("...................");

