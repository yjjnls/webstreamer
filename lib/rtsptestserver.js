

var IApp = require('./app').IProcessor;
const CodecMap =  require('./codecmap').TABLE;

/*const _Pattern={
    'smpte'              : 0 ,// SMPTE 100% color bars
    'snow'               : 1 ,// Random (television snow)
    'black'              : 2 ,// 100% Black
    'white'              : 3 ,// 100% White
    'red'                : 4 ,// Red
    'green'              : 5 ,// Green
    'blue'               : 6 ,// Blue
    'checkers-1'         : 7 ,// Checkers 1px
    'checkers-2'         : 8 ,// Checkers 2px
    'checkers-4'         : 9 ,// Checkers 4px
    'checkers-8'         : 10,// Checkers 8px
    'circular'           : 11,// Circular
    'blink'              : 12,// Blink
    'smpte75'            : 13,// SMPTE 75% color bars
    'zone-plate'         : 14,// Zone plate
    'gamut'              : 15,// Gamut checkers
    'chroma-zone-plate'  : 16,// Chroma zone plate
    'solid-color'        : 17,// Solid color
    'ball'               : 18,// Moving ball
    'smpte100'           : 19,// SMPTE 100% color bars
    'bar'                : 20,// Bar
    'pinwheel'           : 21,// Pinwheel
    'spokes'             : 22,// Spokes
    'gradient'           : 23,// Gradient
    'colors'             : 24 // Colors
}*/

class RTSPTestServer extends IApp  {

    constructor(webstreamer,name) {
        super(webstreamer,name,'RTSPTestServer');

        this.option={
            path  : '/test',
            video : {
                codec: 'h264',
                pattern: 'smpte',
                width: 352,
                height: 288,
                fps: 30, //30 frames per second
                bitrate: 512,
                kfi : 5, //Maximal distance between two key-frames (0 for automatic)
                overlay:{
                    type:'time',
                    text:'',
                    font:'Sans 24',
                    'draw-shadow':true,
                    'draw-outline':true,
                    'outline-color':0xFF000000, //big-endian ARGB
                    xpos:0.0, //float 0 - 1
                    ypos:0.0, //float 0 - 1
                    color:0xFFFFFFFF //text color big-endian ARGB
                }
            },

            audio : {
                codec : 'g711a',//g711u
                freq  : 440,
                rate  : 8000, //
                channels : 1
            }              
        };
    }


    startup(){

        var obj ={
            path   :  this.option.path,
            launch : this.source_bin_description() 
        };

        return this.call('startup',obj);
    }

    stop(){
        return this.call('stop');        
    }

    source_bin_description()
    {
        var video = this.video_description();
        var audio = this.audio_description();
        var desc = '( ';
        if( video ){
            desc +=` ${video} name=pay0 `;
        }

        if( audio ){
            if( video ){
                desc +=` !${audio} name=pay1`;
            } else {
                desc +=` !${audio} name=pay0`;
            }
        }
        return desc + ' )';

    }

    video_description(){
        var v = this.option.video;
        if( !v ){
            return;
        }

        var line = `videotestsrc is-live=1 pattern=${v.pattern}`;

        var o = v.overlay;
        if( o) {
            line = `${line} ! ${o.type}overlay valignment=3 halignment=4 time-mode=2`;
            line = `${line} xpos=${o.xpos} ypos=${o.xpos} color=${o.color} font-desc="${o.font}"`;
            if( o.text ){
                line =`${line}="${o.text}"`;
            }

            line =`${line} draw-shadow=${o['draw-shadow']} draw-outline=${o['draw-outline']} outline-color=${o['outline-color']}`;

        }

        line =`${line}  ! video/x-raw, format=(string)I420, width=(int)${v.width}, height=(int)${v.height}`;
        line =`${line}  ! x264enc bitrate=${v.bitrate} key-int-max=${v.kfi} !rtph264pay pt=96`;
        return line;
    }

    audio_description(){
        
        var a = this.option.audio;
        if( ! a ){
            return;
        }
        var line = `audiotestsrc is-live=1 freq=${a.freq} ! audio/x-raw, rate=(int)${a.rate}, channels=(int)${a.channels}`;

        var codec = CodecMap[a.codec];
        line = `${line} ! ${codec.enc} ! ${codec.pay} pt=97`;
        return line;
    }


    launch_string(){

        var line = 'videotestsrc is-live=1 pattern=' + this.option.video.pattern;

        //let video   = this.option.video;
        let overlay = this.option.overlay;
        if(overlay){
            let type;
            if( type ==='time' ){
                
                line += ' ! timeoverlay valignment=3 halignment=4 time-mode=2 ';
                line += ' xpos=' + overlay.xpos;
                line += ' ypos=' + overlay.ypos;
                line += ' color=' + overlay.color;
                line += ' fond-desc=' + overlay.font;
                if( overlay.text ){
                    line += ' text=' + overlay.text;
                }
            }

            line +=`! video/x-raw, format=(string)I420, width=(int)${overlay}., height=(int)480`;

        }




        switch( this.option.video )
        {
        case 'h264':
            line += `${line} ! x264enc ! rtph264pay name=pay0 pt=96`; //" ! x264enc ! rtph264pay name=pay0 pt=96";
            break;
        }
        return '( ' + line +' )';
    }

    
}

module.exports = {
    RTSPTestServer : RTSPTestServer,
};