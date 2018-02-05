/**
 * Created by Ganchao on 2018/2/2.
 */

const Webrtc = require('../schema/webrtc_generated').webstreamer.webrtc;
const Topics = require('../schema/webrtc_generated').webstreamer.webrtc.topics;
const Webstreamer = require('../schema/webstreamer_generated').webstreamer;

function pipelineBuf(builder, streamId, videoCodec, audioCodec) {
    let idStr = builder.createString(streamId.toString());

    Webstreamer.Pipeline.startPipeline(builder);

    Webstreamer.Pipeline.addId(builder, idStr);

    switch (audioCodec.toUpperCase()) {
        case 'OPUS':
            Webstreamer.Pipeline.addAudioCodec(builder, Webstreamer.AudioCodec.OPUS);
            break;
        case 'PCMA':
            Webstreamer.Pipeline.addAudioCodec(builder, Webstreamer.AudioCodec.PCMA);
            break;
        default:
            Webstreamer.Pipeline.addAudioCodec(builder, Webstreamer.AudioCodec.OPUS);
            break;
    }

    switch (videoCodec.toUpperCase()) {
        case 'H264':
            Webstreamer.Pipeline.addVideoCodec(builder,Webstreamer.VideoCodec.H264);
            break;
        case 'H265':
            Webstreamer.Pipeline.addVideoCodec(builder,Webstreamer.VideoCodec.H265);
            break;
        case 'VP8':
            Webstreamer.Pipeline.addVideoCodec(builder,Webstreamer.VideoCodec.H264);
            break;
        default:
            Webstreamer.Pipeline.addVideoCodec(builder,Webstreamer.VideoCodec.H264);
            break;
    }

    return Webstreamer.Pipeline.endPipeline(builder);
}

function endpointBaseBuf(builder, endpointId, endpointType = 'RTSPCLIENT') {
    let idStr = builder.createString(endpointId.toString());

    Webstreamer.EndpointBase.startEndpointBase(builder);

    Webstreamer.EndpointBase.addId(builder, idStr);

    switch (endpointType.toUpperCase()) {
        case 'WEBRTC':
            Webstreamer.EndpointBase.addType(builder, Webstreamer.EndpointType.WEBRTC);
            break;
        case 'RTSPCLIENT':
            Webstreamer.EndpointBase.addType(builder, Webstreamer.EndpointType.RTSPCLIENT);
            break;
        default:
            Webstreamer.EndpointBase.addType(builder, Webstreamer.EndpointType.RTSPCLIENT);
            break;
    }

    return Webstreamer.EndpointBase.endEndpointBase(builder);
}

function rtspClientBuf(builder, endpointId, rtspUrl, endpointType) {
    let rtspUrlStr;
    if(rtspUrl && typeof rtspUrl === 'string') {
        rtspUrlStr = builder.createString(rtspUrl);
    }
    let endpointBase = endpointBaseBuf(builder, endpointId, endpointType);

    Webstreamer.RtspClient.startRtspClient(builder);

    Webstreamer.RtspClient.addBase(builder, endpointBase);

    if(rtspUrl && typeof rtspUrl === 'string') {
        Webstreamer.RtspClient.addUrl(builder, rtspUrlStr);
    }

    return Webstreamer.RtspClient.endRtspClient(builder);
}

function endpointBuf(builder, endpointId, rtspUrl, endpointType = 'RTSPCLIENT') {
    let rtspClient = rtspClientBuf(builder, endpointId, rtspUrl, endpointType);

    Webstreamer.Endpoint.startEndpoint(builder);

    switch (endpointType.toUpperCase()) {
        case 'RTSPCLIENT':
            Webstreamer.Endpoint.addRtspclient(builder, rtspClient);
            break;
        default:
            Webstreamer.Endpoint.addRtspclient(builder, rtspClient);
            break;
    }

    return Webstreamer.Endpoint.endEndpoint(builder);
}

module.exports = {
    pipelineBuf,
    endpointBuf
};