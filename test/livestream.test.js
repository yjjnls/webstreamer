const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');

// describe('WebStreamer', function () {
//     describe('livestream', function () {
//         before(async () => {
//             try {
//                 await plugin.Initialize({
//                     rtsp_server: {
//                         port: 554
//                     }
//                 });
//             } catch (err) {
//                 throw new Error(err.toString());
//             }
//         });

//         after(async () => {
//             await plugin.Terminate();
//         });

//         it(`rtspclient`, async () => {
//             // create livestream
//             console.log('~~~0');
//             let livestream = new plugin.LiveStream("livestream1");
//             console.log('~~~1');
//             await livestream.initialize();
//             // add performer
//             let endpoint = {
//                 name: 'endpoint1',
//                 protocol: 'rtspclient', // rtspclient/rtspserver/autoshowclient
//                 url: 'rtsp://172.16.66.65/id=1',
//                 video_codec: 'h264', // optional
//                 audio_codec: 'pcma' // optional
//             }
//             console.log('~~~2');
//             await livestream.addPerformer(endpoint);
//             console.log('~~~3');
//             // startup
//             await livestream.startup();
//             // add audience
//         });

//     });
// });
async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
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
    await sleep(10000);
    await livestream_app.removeAudience(audience_ep.name);
    await sleep(3000);



    // stop app
    await livestream_app.stop();
    await livestream_app.terminate();
    await sleep(3000);

    /** ---------------------------------- */
    await rtsp.stop();
    await rtsp.terminate();
    await plugin.Terminate();

}

test();