/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const WS   = require('../index');
const Poll = require('../index').Poll;
const tesseract = require('node-tesseract');
const Promise = require('bluebird');


function TimeToMillisecond (str){ 
    var reg = /^(\d{1}):(\d{2}):(\d{2}).(\d{3})$/; 
    var r = str.match(reg); 
    if( r ){
        var h  = parseInt(r[1])
        var m  = parseInt(r[2])
        var s  = parseInt(r[3])
        var ms = parseInt(r[4])
        return (h* 60*60 +m* 60 + s)*1000 +ms
    }
    return null;
} 

function ocr ( filename ){

    var options = {
        psm: 7,
        //binary: 'C:/Program Files (x86)/Tesseract-OCR/tesseract'//'/usr/local/bin/tesseract',
        //config: 'digits'
        };

    return new Promise(function (resolve, reject) {
       tesseract.process(filename, options, function(err, text) {
           //console.log(err,"!",text)
           if(err) {
               reject(err);
           } else {
               var strtime = text.replace(/[\r\n\f]/g,"")
               var ms = TimeToMillisecond(strtime)
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

    before(async function()  {
        await WS.Initialize()
    });

    after(async function() {
        await WS.Terminate()

    });



    it(`GStreamerVideoTestSrcAnalyzer`, async function() {
        const SIZE=0
        let images=[];
        var app = new WS.GStreamerVideoTestSrcAnalyzer('v1111');
        app.on('multifilesink',async function (data,meta) {
            var j = JSON.parse(data.toString('utf8'));
            var filename = j["filename"]
            var time = j["stream-time"]/1000000
            images.push({filename:filename,time:time})
        })
        
        await app.initialize();

        await app.startup()
   
        await Poll(()=>{
            return images.length >= SIZE;}
        )
        await app.stop();
   
        await app.terminate();
        for(var i=0 ; i < SIZE; i++){
            let filename = images[i].filename
            let time = images[i].time
            var ms=null; 
            try {
                ms = await ocr(filename);
            }catch (err){
                assert.fail(err)
            }
            assert.closeTo(time, ms, 75, 'ocr recognize time')

        }
    });


});

