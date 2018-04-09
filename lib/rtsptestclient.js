
/*
gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test name=r r.       \
               ! queue !capsfilter caps="application/x-rtp,media=video"  \
               ! rtph264depay ! decodebin  ! autovideosink sync=false r. \
               ! queue ! capsfilter caps="application/x-rtp,media=audio" \
               ! rtppcmadepay ! decodebin ! audioconvert !spectrascope 
               ! autovideosink sync=false
*/
var IElementWatcher = require('./elementwatcher').IElementWatcher;
const CodecMap =  require('./codecmap').TABLE;

class RTSPTestClient extends IElementWatcher  {

    constructor(webstreamer,name) {
        super(webstreamer,name,'RTSPTestClient');

        this.spectrum={
            interval : 100*1000*1000, //Interval of time between message posts (in nanoseconds)
            bands    : 128, //Number of frequency bands
            threshold: -60, //dB threshold for result. All lower values will be set to this
        }
    }


    startup(){
        this.launch = '(audiotestsrc ! audioconvert ! audio/x-raw rate=32000 ! spectrum name=spectrum ! spectrascope ! autovideosink)'
        this.elements ={
            spectrum:{
                type : 'spectrum'
            }
        }

        //var obj ={
        //    spectrum   :  this.spectrum,
        //    //audiotestsrc ! audioconvert ! spectrascope ! autovideosink
        //    launch     : '(audiotestsrc ! audioconvert ! audio/x-raw rate=32000 ! spectrum name=spectrum ! spectrascope ! autovideosink)'
        //    //'(audiotestsrc freq=6000 ! audioconvert ! spectrum name=spectrum ! fakesink)'
        //}       
        

        return this.startup_();
    }

    stop(){
        return this.call('stop');        
    }
   
}

module.exports = {
    RTSPTestClient : RTSPTestClient,
};