
/*
gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test name=r r.       \
               ! queue !capsfilter caps="application/x-rtp,media=video"  \
               ! rtph264depay ! decodebin  ! autovideosink sync=false r. \
               ! queue ! capsfilter caps="application/x-rtp,media=audio" \
               ! rtppcmadepay ! decodebin ! audioconvert !spectrascope 
               ! autovideosink sync=false
*/
var IApp = require('./app').IProcessor;
const CodecMap =  require('./codecmap').TABLE;

class IElementWatcher extends IApp  {

    constructor(webstreamer,name,typename) {
        super(webstreamer,name,typename);

        this.spectrum={
            //interval : 100*1000*1000, //Interval of time between message posts (in nanoseconds)
            bands    : 128, //Number of frequency bands
            threshold: -60, //dB threshold for result. All lower values will be set to this
        }

        //watch-list
        this.elements={}
        this.launch = null;

        //test
        this.elements={
            'spectrum':{
                type: 'spectrum'
            }
        }
        this.launch = "audiotestsrc ! audioconvert !spectrum name=spectrum ! spectrascope ! autovideosink";
    }


    startup_(){
        var obj ={
            elements   : this.elements,
            launch     : this.launch
        }       

        //obj.launch = 'rtspsrc location=rtsp://127.0.0.1/test ! capsfilter caps="application/x-rtp,media=audio" \
        //! rtppcmadepay ! decodebin ! audioconvert ! spectrum name=spectrum !spectrascope '
        //console.log("~~~~~~~~~~~>",obj)

        return this.call('startup',obj)
    }

    stop(){
        return this.call('stop');        
    }
   
}

module.exports = {
    IElementWatcher : IElementWatcher,
};