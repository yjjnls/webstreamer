/**
 * Created by Ganchao on 2018/3/1.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const flatbuffers = require('../../schema/flatbuffers').flatbuffers;
const commonBuffer = require('../../lib/commonBuf');
const livestreamerBuffer = require('../../lib/livestreamerBuf');
const webstreamerLivestreamer = require('../../schema/livestreamer_generated').webstreamer.livestreamer;
const webstreamerCommon = require('../../schema/common_generated').webstreamer;

describe('webstreamer livestreamer flatbuf message tests', function () {
    describe('#Create', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            name = 'livestream1',
            endpointName = 'endpoint1',
            url = 'rtsp://172.16.66.66/id=1',
            initiative = true,
            audioChannelName = 'audio',
            audioMode = 'sendrecv',
            audioCodec = 'OPUS',
            videoChannelName = 'video',
            videoMode = 'sendonly',
            videoCodec = 'H265';
        let msgObj;

        beforeEach(function () {
            let audioChannel = commonBuffer.channelBuf(builder, audioChannelName, audioCodec, audioMode),
                videoChannel = commonBuffer.channelBuf(builder, videoChannelName, videoCodec, videoMode),
                endpoint = commonBuffer.endpointBuf(builder, endpointName, url, initiative, videoChannel, audioChannel);

            endbuilder = livestreamerBuffer.liveStreamerCreateBuf(builder, name, endpoint);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerLivestreamer.Create.getRootAsCreate(buf);
        });

        it(`Create name should return ${name}`, function () {
            assert.equal(msgObj.name(), name);
        });

        it(`Create source name should return ${endpointName}`, function () {
            assert.equal(msgObj.source(new webstreamerCommon.Endpoint).name(), endpointName);
        });

        it(`Create source url should return ${url}`, function () {
            assert.equal(msgObj.source(new webstreamerCommon.Endpoint).url(), url);
        });

        it(`Create source initiative should return ${initiative}`, function () {
            assert.equal(msgObj.source(new webstreamerCommon.Endpoint).initiative(), initiative);
        });

        it(`Create source channel test should return ok`, function () {
            let expectedNames = [videoChannelName, audioChannelName],
                expectedCodec = [videoCodec, audioCodec],
                expectedMode = [videoMode, audioMode];
            let channelLength = msgObj.source(new webstreamerCommon.Endpoint).channelLength();

            for(let i = 0; i< channelLength; i++) {
                assert.equal(msgObj.source(new webstreamerCommon.Endpoint).channel(i).name(), expectedNames[i]);
                assert.equal(msgObj.source(new webstreamerCommon.Endpoint).channel(i).codec(), expectedCodec[i]);
                assert.equal(msgObj.source(new webstreamerCommon.Endpoint).channel(i).mode(), expectedMode[i]);
            }
        });
    });

    describe('#Destroy', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            name = 'livestream1';
        let msgObj;

        beforeEach(function () {
            endbuilder = livestreamerBuffer.liveStreamDestroyBuf(builder, name);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerLivestreamer.Destroy.getRootAsDestroy(buf);
        });

        it(`Destroy name should return ${name}`, function () {
            assert.equal(msgObj.name(), name);
        });
    });

    describe('#AddViewer', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            componentName = 'livestream1',
            endpointName = 'endpoint1',
            url = 'rtsp://172.16.66.66/id=1',
            initiative = true,
            audioChannelName = 'audio',
            audioMode = 'sendrecv',
            audioCodec = 'OPUS',
            videoChannelName = 'video',
            videoMode = 'sendonly',
            videoCodec = 'H265';
        let msgObj;

        beforeEach(function () {
            let audioChannel = commonBuffer.channelBuf(builder, audioChannelName, audioCodec, audioMode),
                videoChannel = commonBuffer.channelBuf(builder, videoChannelName, videoCodec, videoMode),
                endpoint = commonBuffer.endpointBuf(builder, endpointName, url, initiative, videoChannel, audioChannel);

            endbuilder = livestreamerBuffer.liveStreamAddViewerBuf(builder, componentName, endpoint);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerLivestreamer.AddViewer.getRootAsAddViewer(buf);
        });

        it(`AddViewer component name should return ${componentName}`, function () {
            assert.equal(msgObj.component(), componentName);
        });

        it(`AddViewer viewer name should return ${endpointName}`, function () {
            assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).name(), endpointName);
        });

        it(`AddViewer viewer url should return ${url}`, function () {
            assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).url(), url);
        });

        it(`AddViewer viewer initiative should return ${initiative}`, function () {
            assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).initiative(), initiative);
        });

        it(`AddViewer viewer channel test should return ok`, function () {
            let expectedNames = [videoChannelName, audioChannelName],
                expectedCodec = [videoCodec, audioCodec],
                expectedMode = [videoMode, audioMode];
            let channelLength = msgObj.viewer(new webstreamerCommon.Endpoint).channelLength();

            for(let i = 0; i< channelLength; i++) {
                assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).channel(i).name(), expectedNames[i]);
                assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).channel(i).codec(), expectedCodec[i]);
                assert.equal(msgObj.viewer(new webstreamerCommon.Endpoint).channel(i).mode(), expectedMode[i]);
            }
        });
    });

    describe('#RemoveViewer', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            component = 'livestream1',
            endpoint = 'endpoint1';
        let msgObj;

        beforeEach(function () {
            endbuilder = livestreamerBuffer.liveStreamRemoveViewerBuf(builder, component, endpoint);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerLivestreamer.RemoveViewer.getRootAsRemoveViewer(buf);
        });

        it(`RemoveViewer component should return ${component}`, function () {
            assert.equal(msgObj.component(), component);
        });

        it(`RemoveViewer endpoint should return ${endpoint}`, function () {
            assert.equal(msgObj.endpoint(), endpoint);
        });
    });

    describe('#LiveStreamError', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            code = 1,
            reason = 'error';
        let msgObj;

        beforeEach(function () {
            endbuilder = livestreamerBuffer.liveStreamErrorBuf(builder, code, reason);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerLivestreamer.LiveStreamError.getRootAsLiveStreamError(buf);
        });

        it(`LiveStreamError code should return ${code}`, function () {
            assert.equal(msgObj.code(), code);
        });

        it(`LiveStreamError reason should return ${reason}`, function () {
            assert.equal(msgObj.reason(), reason);
        });
    });

});