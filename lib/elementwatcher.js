
/*
gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test name=r r.       \
               ! queue !capsfilter caps="application/x-rtp,media=video"  \
               ! rtph264depay ! decodebin  ! autovideosink sync=false r. \
               ! queue ! capsfilter caps="application/x-rtp,media=audio" \
               ! rtppcmadepay ! decodebin ! audioconvert !spectrascope 
               ! autovideosink sync=false
*/
var IApp = require('./app').IApp;
const CodecMap =  require('./codecmap').TABLE;

class IElementWatcher extends IApp  {

    constructor(webstreamer,name) {
        super(webstreamer,name,'ElementWatcher');
    this.launch = null;//
    }

    startup(){
        return this.call('startup',{
            launch     : this.launch
        })
    }

    stop(){
        return this.call('stop');        
    }
   
}

module.exports = {
    IElementWatcher : IElementWatcher,
};