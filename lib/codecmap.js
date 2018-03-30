

var codec_table ={
    g711a :{
        enc   :  'alawenc',
        dec   :  'alawdec',
        pay   :  'rtppcmapay',
        depay :  'rtppcmadepay'
    },

    g711u :{
        enc   :  'mulawenc',
        dec   :  'mulawdec',
        pay   :  'rtppcmupay',
        depay :  'rtppcmudepay'
    },




    //Video
    h264 :{
        enc   :  'x264enc',
        dec   :  'avdec_h264',
        pay   :  'rtph264pay',
        depay :  'rtph264depay'
    },

    openh264 :{
        enc   :  'openh264enc',
        dec   :  'openh264dec',
        pay   :  'rtph264pay',
        depay :  'rtph264depay'
    },
}

codec_table.pcma=codec_table.g711a
codec_table.pcmu=codec_table.g711u

module.exports = {
    TABLE : codec_table
};