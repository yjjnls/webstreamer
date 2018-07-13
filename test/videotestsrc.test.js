/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let assert = chai.assert;

const webstreamer = require('../index');
let WS   = webstreamer,
    poll = webstreamer.utils.poll,
    rmdirSync = webstreamer.utils.rmdirSync,
    parseTime = webstreamer.utils.parseTime;

const tesseract = require('node-tesseract');
const Promise = require('bluebird');
const uuid = require('uuid');
const fs = require('fs');

function ocr ( filename ){

    let options = {
        psm: 7,
        config: 'time'
    };

    return new Promise(function (resolve, reject) {
       tesseract.process(filename, options, function(err, text) {
           if(err) {
               reject(err);
           } else {

               var strtime = text.replace(/[\r\n\f]/g,"")
               strtime = strtime.replace(/[,]/g,".")
               var ms = parseTime(strtime)
               if( ms == null ){
                   reject("invalide time format:" + strtime);
               } else {
                   resolve(ms)
               }                
           }
       })
    })
}

describe('GStreamerTestSrcAnalyzer', function () {
    let out_dir=null;

    before(async function()  {
        await WS.Initialize();
    });

    after(async function() {
        await WS.Terminate();

    });

    beforeEach( async function(){

    })

    afterEach( async function(){
        if( out_dir){
            if( fs.existsSync(out_dir)){
                rmdirSync(out_dir);
            }
            out_dir = null;
        }
    })

    it(`GStreamerVideoTestSrcAnalyzer`, async function() {
        const SIZE=3
        let images=[];
        out_dir = 'img@' + uuid.v4();
        var app = new WS.GStreamerVideoTestSrcAnalyzer('GStreamerVideoTestSrcAnalyzer.1');
        app.option.image.fps = 10 //10 frame per second
        app.option.image.location =`${out_dir}/%05d.jpg`
        fs.mkdirSync(out_dir)

        app.on('multifilesink',async function (data,meta) {
            var j = JSON.parse(data.toString('utf8'));
            var filename = j["filename"]
            var time = j["stream-time"]/1000000
            images.push({filename:filename,time:time})
            
        })
        
        await app.initialize();

        await app.startup();
   
        await poll(()=>{
            return images.length >= SIZE;}
        )
        await app.stop();

        await app.terminate();
      
        for(var i=0 ; i < SIZE; i++){
            let filename = images[i].filename
            let time = images[i].time
            var ms = await ocr(filename);
            assert.closeTo(time, ms, 75, 'ocr recognize time')

        }
    });


});

