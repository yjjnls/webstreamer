/**
 * Created by Ganchao on 2018/3/1.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const flatbuffers = require('../../schema/flatbuffers').flatbuffers;

const commonBuffer = require('../../lib/commonBuf');
const webstreamerCommon = require('../../schema/common_generated').webstreamer;

describe('webstreamer common flatbuf message tests', function () {
    describe('#Channel', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            channelName = 'audio',
            audioMode = 'sendrecv',
            audioCodec = 'OPUS';
        let msgObj;

        beforeEach(function () {
            endbuilder = commonBuffer.channelBuf(builder, channelName, audioCodec, audioMode);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerCommon.Channel.getRootAsChannel(buf);
        });

        it(`Channel name should return ${channelName}`, function () {
            assert.equal(msgObj.name(), channelName);
        });

        it(`Channel codec should return ${audioCodec}`, function () {
            assert.equal(msgObj.codec(), audioCodec);
        });

        it(`Channel mode should return ${audioMode}`, function () {
            assert.equal(msgObj.mode(), audioMode);
        });
    });

    describe('#Endpoint', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            name = 'endpoint1',
            protocol = 'RTSP',
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
                videoChannel = commonBuffer.channelBuf(builder, videoChannelName, videoCodec, videoMode);
            endbuilder = commonBuffer.endpointBuf(builder, name, protocol, url, initiative, videoChannel, audioChannel);

            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerCommon.Endpoint.getRootAsEndpoint(buf);
        });

        it(`Endpoint name should return ${name}`, function () {
            assert.equal(msgObj.name(), name);
        });

        it(`Endpoint protocol should return ${protocol}`, function () {
            assert.equal(msgObj.protocol(), protocol);
        });

        it(`Endpoint url should return ${url}'`, function () {
            assert.equal(msgObj.url(), url);
        });

        it(`Endpoint initiative should return ${initiative}`, function () {
            assert.equal(msgObj.initiative(), initiative);
        });

        it(`Endpoint channel test should return ok`, function () {
            let expectedNames = [videoChannelName, audioChannelName],
                expectedCodec = [videoCodec, audioCodec],
                expectedMode = [videoMode, audioMode];

            for(let i = 0; i< msgObj.channelLength(); i++) {
                assert.equal(msgObj.channel(i).name(), expectedNames[i]);
                assert.equal(msgObj.channel(i).codec(), expectedCodec[i]);
                assert.equal(msgObj.channel(i).mode(), expectedMode[i]);
            }
        });
    });

    describe('#Topic', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            type = 'WebRTC.JSEP',
            component = 'livestream1',
            endpoint = 'endpoint1',
            content = 'sdp';
        let msgObj;

        beforeEach(function () {
            endbuilder = commonBuffer.topicBuf(builder, type, component, endpoint, content);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerCommon.Topic.getRootAsTopic(buf);
        });

        it(`Topic type should return ${type}'`, function () {
            assert.equal(msgObj.type(), type);
        });

        it(`Topic component should return ${component}`, function () {
            assert.equal(msgObj.component(), component);
        });

        it(`Topic endpoint should return ${endpoint}`, function () {
            assert.equal(msgObj.endpoint(), endpoint);
        });

        it(`Topic content should return ${content}`, function () {
            assert.equal(msgObj.content(), content);
        });
    });

    describe('#Subscription', function () {
        let builder = new flatbuffers.Builder(0),
            endbuilder;
        let buf,
            types = ['status', 'sdp'],
            component = 'livestream1',
            endpoint = 'endpoint1';
        let msgObj;

        beforeEach(function () {
            endbuilder = commonBuffer.subscriptionBuf(builder, component, endpoint, types);
            builder.finish(endbuilder);
            buf = builder.dataBuffer();

            msgObj = webstreamerCommon.Subscription.getRootAsSubscription(buf);
        });

        it(`Subscription types test should return ok`, function () {
            for(let i = 0; i < msgObj.typeLength(); i++) {
                assert.equal(msgObj.type(i), types[i]);
            }
        });

        it(`Subscription component should return ${component}`, function () {
            assert.equal(msgObj.component(), component);
        });

        it(`Subscription endpoint should return ${endpoint}`, function () {
            assert.equal(msgObj.endpoint(), endpoint);
        });
    });
});