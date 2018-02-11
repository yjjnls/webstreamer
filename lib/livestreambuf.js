const flatbuffers = require('../schema/flatbuffers').flatbuffers;
const Webrtc = require('../schema/webrtc_generated').webstreamer.webrtc;
const Topics = require('../schema/webrtc_generated').webstreamer.webrtc.topics;
const Webstreamer = require('../schema/webstreamer_generated').webstreamer;
const bufGenerator = require('./bufGenerator');

/**
 * 生成LiveStreamCreate的flatbuf 消息
 * @method generateLiveStreamCreateMsgBuf
 * @param {string} streamId livestream的id
 * @param {string} endpointId endpoint id 终端
 * @param {string} endpointType 终端类型
 * @param {string} rtspurl 终端类型为RTSPCLIENT时，IPC的rtsp地址
 * @param {string} videoCodec 终端类型为RTSPCLIENT时，IPC的视频编码格式
 * @param {string} audioCodec 终端类型为RTSPCLIENT时，IPC的音频编码格式
 * @return {flatbuffers.ByteBuffer} LiveStreamCreate 消息buf
 */
function generateLiveStreamCreateMsgBuf(streamId, endpointId, endpointType, rtspurl, videoCodec, audioCodec) {
    let builder = new flatbuffers.Builder(0);
    let pipelineBuf = bufGenerator.pipelineBuf(builder, streamId, videoCodec, audioCodec),
        endpointBuf = bufGenerator.endpointBuf(builder, endpointId, rtspurl, endpointType);

    Webstreamer.LiveStreamCreate.startLiveStreamCreate(builder);
    Webstreamer.LiveStreamCreate.addPipeline(builder, pipelineBuf);
    Webstreamer.LiveStreamCreate.addEndpoint(builder, endpointBuf);

    let orc = Webstreamer.LiveStreamCreate.endLiveStreamCreate(builder);
    builder.finish(orc);

    return builder.dataBuffer();
}

/**
 * 生成 LiveStreamDestroy 的 flatbuf 消息
 * @method generateLiveStreamDestroyMsgBuf
 * @param {string} streamId livestream id
 * @return {flatbuffers.ByteBuffer} LiveStreamDestroy 消息buf
 */
function generateLiveStreamDestroyMsgBuf(streamId) {
    let builder = new flatbuffers.Builder(0),
        idStr = builder.createString(streamId.toString());

    Webstreamer.LiveStreamDestroy.startLiveStreamDestroy(builder);
    Webstreamer.LiveStreamDestroy.addId(builder, idStr);

    let orc = Webstreamer.LiveStreamDestroy.endLiveStreamDestroy(builder);
    builder.finish(orc);

    return builder.dataBuffer();
}

/**
 * 生成 LiveStreamAddEndpoint 的 flatbuf 消息
 * @method generateLiveStreamAddEndpointMsgBuf
 * @param {string} streamId livestream id
 * @param {string} endpointId endpoint id
 * @return {flatbuffers.ByteBuffer} LiveStreamDestroy 消息buf
 */
function generateLiveStreamAddEndpointMsgBuf(streamId, endpointId) {
    let builder = new flatbuffers.Builder(0),
        idStr = builder.createString(streamId.toString()),
        endpointBuf = bufGenerator.endpointBuf(builder, endpointId);

    Webstreamer.LiveStreamAddEndpoint.startLiveStreamAddEndpoint(builder);
    Webstreamer.LiveStreamAddEndpoint.addId(builder, idStr);
    Webstreamer.LiveStreamAddEndpoint.addEndpoint(builder, endpointBuf);

    let orc = Webstreamer.LiveStreamAddEndpoint.endLiveStreamAddEndpoint(builder);
    builder.finish(orc);

    return builder.dataBuffer();
}

/**
 * 生成 LiveStreamRemoveEndpoint 的 flatbuf 消息
 * @method generateLiveStreamRemoveEndpointMsgBuf
 * @param {string} streamId livestream id
 * @param {string} endpointId endpoint id
 * @return {flatbuffers.ByteBuffer} LiveStreamDestroy 消息buf
 */
function generateLiveStreamRemoveEndpointMsgBuf(streamId, endpointId) {
    let builder = new flatbuffers.Builder(0),
        streamIdStr = builder.createString(streamId.toString()),
        endpointIdStr = builder.createString(endpointId.toString());


    Webstreamer.LiveStreamRemoveEndpoint.startLiveStreamRemoveEndpoint(builder);
    Webstreamer.LiveStreamRemoveEndpoint.addId(builder, streamIdStr);
    Webstreamer.LiveStreamRemoveEndpoint.addEndpointId(builder, endpointIdStr);

    let orc = Webstreamer.LiveStreamRemoveEndpoint.endLiveStreamRemoveEndpoint(builder);
    builder.finish(orc);

    return builder.dataBuffer();
}

module.exports = {
    generateLiveStreamCreateMsgBuf,
    generateLiveStreamDestroyMsgBuf,
    generateLiveStreamAddEndpointMsgBuf,
    generateLiveStreamRemoveEndpointMsgBuf
};