/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;
const webstreamerBuffer = require('../../lib/webstreamerBuf');
const Webstreamer = require('../../schema/webstreamer_generated').webstreamer;
const webstreamerLivestreamer = require('../../schema/livestreamer_generated').webstreamer.livestreamer;
const webstreamerCommon = require('../../schema/common_generated').webstreamer;

describe('Webstreamer flatbuf message tests', function () {
    describe('#LiveStreamCreate', function () {
        let buf,
            rtspurl = 'rtsp://172.16.66.66/id=1',
            videoCodec = 'h265',
            videoMode = 'sendonly',
            audioMode = 'sendrecv',
            audioCodec = 'OPUS',
            component = 'livestream1',
            protocol = 'RTSP',
            endpoint = 'endpoint2';
        let root;
        beforeEach(function () {
            buf = webstreamerBuffer.generateLiveStreamCreateMsgBuf(component, endpoint, protocol, rtspurl, videoCodec, audioCodec, videoMode, audioMode);
            root = Webstreamer.root.getRootAsroot(buf);
        });

        it(`root anytype should return 'Webstreamer.Any.webstreamer_livestreamer_Create'`, function () {
            assert.equal(root.anyType(), Webstreamer.Any.webstreamer_livestreamer_Create);
        });

        it(`webstreamer.livestreamer.Create name should return ${component}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Create()).name(), component);
        });

        it(`webstreamer.livestreamer.Create source name should return ${endpoint}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).name(), endpoint);
        });

        it(`webstreamer.livestreamer.Create source protocol should return ${protocol}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).protocol(), protocol);
        });

        it(`webstreamer.livestreamer.Create source url should return ${rtspurl}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).url(), rtspurl);
        });

        it(`webstreamer.livestreamer.Create source initiative should return 1`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).initiative(), 1);
        });

        it(`webstreamer.livestreamer.Create source channel test should return ok`, function () {
            let expectedNames = ['video', 'audio'],
                expectedCodec = [videoCodec, audioCodec],
                expectedMode = [videoMode, audioMode];
            let channelLength = root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).channelLength();

            for(let i = 0; i< channelLength; i++) {
                assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).channel(i).name(), expectedNames[i]);
                assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).channel(i).codec(), expectedCodec[i]);
                assert.equal(root.any(new webstreamerLivestreamer.Create()).source(new webstreamerCommon.Endpoint).channel(i).mode(), expectedMode[i]);
            }

        });

    });

    describe('#LiveStreamDestroy', function () {
        let buf,
            name = 'livestream1';
        let root;

        beforeEach(function () {
            buf = webstreamerBuffer.generateLiveStreamDestroyMsgBuf(name);
            root = Webstreamer.root.getRootAsroot(buf);
        });

        it(`root anytype should return 'Webstreamer.Any.webstreamer_livestreamer_Destroy'`, function () {
            assert.equal(root.anyType(), Webstreamer.Any.webstreamer_livestreamer_Destroy);
        });

        it(`webstreamer.livestreamer.Destroy name should return ${name}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.Destroy()).name(), name);
        });
    });

    describe('#LiveStreamAddViewer', function () {
        let buf,
            component = 'livestream1',
            endpoint = 'endpoint1',
            audioMode = 'sendrecv',
            audioCodec = 'OPUS',
            videoMode = 'sendonly',
            videoCodec = 'H265';
        let root;

        beforeEach(function () {
            buf = webstreamerBuffer.generateLiveStreamAddViewerMsgBuf(component, endpoint, videoCodec, videoMode, audioCodec, audioMode);
            root = Webstreamer.root.getRootAsroot(buf);
        });

        it(`root anytype should return 'Webstreamer.Any.webstreamer_livestreamer_AddViewer'`, function () {
            assert.equal(root.anyType(), Webstreamer.Any.webstreamer_livestreamer_AddViewer);
        });

        it(`webstreamer.livestreamer.AddViewer component should return ${component}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).component(), component);
        });

        it(`webstreamer.livestreamer.AddViewer viewer name should return ${endpoint}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).name(), endpoint);
        });

        it(`webstreamer.livestreamer.AddViewer viewer protocol should return null`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).protocol(), null);
        });

        it(`webstreamer.livestreamer.AddViewer viewer url should return null`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).url(), null);
        });

        it(`webstreamer.livestreamer.AddViewer viewer initiative should return false`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).initiative(), false);
        });

        it(`webstreamer.livestreamer.AddViewer viewer channel test should return ok`, function () {
            let expectedNames = ['video', 'audio'],
                expectedCodec = [videoCodec, audioCodec],
                expectedMode = [videoMode, audioMode];
            let channelLength = root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).channelLength();

            for(let i = 0; i< channelLength; i++) {
                assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).channel(i).name(), expectedNames[i]);
                assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).channel(i).codec(), expectedCodec[i]);
                assert.equal(root.any(new webstreamerLivestreamer.AddViewer()).viewer(new webstreamerCommon.Endpoint).channel(i).mode(), expectedMode[i]);
            }

        });
    });

    describe('#LiveStreamRemoveViewer', function () {
        let buf,
            component = 'livestream1',
            endpoint = 'endpoint1';
        let root;

        beforeEach(function () {
            buf = webstreamerBuffer.generateLiveStreamRemoveViewerMsgBuf(component, endpoint);
            root = Webstreamer.root.getRootAsroot(buf);
        });

        it(`root anytype should return 'Webstreamer.Any.webstreamer_livestreamer_RemoveViewer'`, function () {
            assert.equal(root.anyType(), Webstreamer.Any.webstreamer_livestreamer_RemoveViewer);
        });

        it(`webstreamer.livestreamer.RemoveViewer component should return ${component}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.RemoveViewer()).component(), component);
        });

        it(`webstreamer.livestreamer.RemoveViewer endpoint should return ${endpoint}`, function () {
            assert.equal(root.any(new webstreamerLivestreamer.RemoveViewer()).endpoint(), endpoint);
        });
    })
});

