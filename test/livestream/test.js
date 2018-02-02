/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;
const liveStream = require('../../lib/livestream');
const Webstreamer = require('../../schema/webstreamer_generated').webstreamer;

describe('LiveStream flatbuf message tests', function () {
    describe('#LiveStreamCreate', function () {
        let buf,
            endpointType = 'RTSPCLIENT',
            rtspurl = 'rtsp://172.16.66.66/id=1',
            videoCodec = 'h265',
            audioCodec = 'OPUS';
        let livestreamcreate;
        beforeEach(function () {
            buf = liveStream.generateLiveStreamCreateMsgBuf(1, 2, endpointType, rtspurl, videoCodec, audioCodec);
            livestreamcreate = Webstreamer.LiveStreamCreate.getRootAsLiveStreamCreate(buf);
        });
        it('Pipeline id should return 1', function () {
            assert.equal(livestreamcreate.pipeline().id(), 1);
        });
        it('Pipeline video codec should return 1', function () {
            assert.equal(livestreamcreate.pipeline().videoCodec(), 1);
        });
        it('Pipeline audio codec should return 1', function () {
            assert.equal(livestreamcreate.pipeline().audioCodec(), 1);
        });
        it('Endpoint id should return 2', function () {
            assert.equal(livestreamcreate.endpoint().rtspclient().base().id(), 2);
        });
        it('Endpoint type should return 0', function () {
            assert.equal(livestreamcreate.endpoint().rtspclient().base().type(), 0);
        });
        it('Endpoint url should return “rtsp://172.16.66.66/id=1”', function () {
            assert.equal(livestreamcreate.endpoint().rtspclient().url(), rtspurl);
        });
    });

    describe('#LiveStreamDestroy', function () {
        let buf,
            id = 1;
        let livestreamdestroy;

        beforeEach(function () {
            buf = liveStream.generateLiveStreamDestroyMsgBuf(id);
            livestreamdestroy = Webstreamer.LiveStreamDestroy.getRootAsLiveStreamDestroy(buf);
        });

        it('id should return 1', function () {
            assert.equal(livestreamdestroy.id(), 1);
        })
    })
});

