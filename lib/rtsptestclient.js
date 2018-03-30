

var IApp = require('./app').IProcessor;
const CodecMap =  require('./codecmap').TABLE;

class IAVAnalyzer extends IApp  {

    constructor(webstreamer,name) {
        super(webstreamer,name);
        this.type = 'AVAnalyzer'
        this.name = name
        this.webstreamer = webstreamer

        this.spectrum={
            interval : 100*1000*1000, //Interval of time between message posts (in nanoseconds)
            bands    : 128, //Number of frequency bands
            threshold: -60, //dB threshold for result. All lower values will be set to this
        }
    }


    startup(){

        var obj ={
            spectrum   :  this.spectrum,
            //audiotestsrc ! audioconvert ! spectrascope ! autovideosink
            launch     : '(audiotestsrc ! audioconvert ! audio/x-raw rate=32000 ! spectrum name=spectrum ! spectrascope ! autovideosink)'
            //'(audiotestsrc freq=6000 ! audioconvert ! spectrum name=spectrum ! fakesink)'
        }       

        return this.call('startup',obj)
    }

    stop(){
        return this.call('stop');        
    }
   
}

module.exports = {
    IAVAnalyzer : IAVAnalyzer,
};