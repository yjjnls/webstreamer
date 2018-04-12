//
// This class is only use for self test on element watcher 
//




/*
gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test name=r r.       \
               ! queue !capsfilter caps="application/x-rtp,media=video"  \
               ! rtph264depay ! decodebin  ! autovideosink sync=false r. \
               ! queue ! capsfilter caps="application/x-rtp,media=audio" \
               ! rtppcmadepay ! decodebin ! audioconvert !spectrascope 
               ! autovideosink sync=false
*/
const IElementWatcher = require('./elementwatcher').IElementWatcher;


class GStreamerVideoTestSrcAnalyzer extends IElementWatcher  {

    constructor(webstreamer,name) {
        super(webstreamer,name);

        this.option ={
            image:{
                fps:5,
                location:'tmp/%05d.jpg'
            }
        }

    }
    
    startup(){

        this.launch = '( ' 
        + 'videotestsrc is-live=1 pattern=white ' 
        + '! timeoverlay valignment=3 halignment=4 time-mode=2 xpos=0 ypos=0 color=0xFF000000 font-desc="Sans 32" ' 
        + `! video/x-raw, format=(string)I420, width=(int)320, height=(int)240, framerate=${this.option.image.fps}/1 ` 
        + '! jpegenc ' 
        + `! multifilesink name=image post-messages=TRUE location=${this.option.image.location}`
        + ' )'


        return this.call('startup',{
            elements   : this.elements,
            launch     : this.launch
        })
    }

    stop(){
        return this.call('stop');        
    }
   
}

module.exports = {
    GStreamerVideoTestSrcAnalyzer : GStreamerVideoTestSrcAnalyzer
};