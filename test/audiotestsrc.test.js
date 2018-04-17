/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const webstreamer = require('../index');
let WS   = webstreamer,
    poll = webstreamer.utils.poll,
    rmdirSync = webstreamer.utils.rmdirSync,
    parseTime = webstreamer.utils.parseTime;


function calcBandNumber(freq,spectrum){
    var bandwith = (spectrum.rate/spectrum.magnitude.length)/2
    var pos = freq/bandwith
    pos = Math.max( pos-1,0)
    return Math.round(pos);
}

describe('GStreamerTestSrcAnalyzer', function () {
    let out_dir=null;

    beforeEach(async function()  {
        await WS.Initialize()
    });

    afterEach(async function() {
        await WS.Terminate()

    });




    it(`GStreamerAudioTestSrcAnalyzer`, async function() {
        let passed =0;

        var app = new WS.GStreamerAudioTestSrcAnalyzer('GStreamerAudioTestSrcAnalyzer.1');

        app.on('spectrum',function (data,meta) {
            var obj = JSON.parse(data.toString('utf8'));
            let magnitude = obj['magnitude'];
            var index = calcBandNumber( app.option.audio.freq,
            {rate: app.option.audio.rate,magnitude: magnitude});

            var max = Math.max.apply(null, magnitude)
            var mag = magnitude[index]
    
            if( Math.abs(mag-max) < 5 ) {
                passed++
            }
            
        });

        await app.initialize()

        await app.startup()
   
        await poll(()=>{ return passed>=3 } ,100,1000)

        await app.stop();

        await app.terminate();
        assert.isAtLeast(passed,3)
    });


});

