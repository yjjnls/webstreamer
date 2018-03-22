/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const WebStreamer = require('../index').WebStreamer;

describe('WebStreamer', function () {

    describe('#interface', function () {
        let webstreamer = undefined;

        before(async () => {
            if( webstreamer === undefined ){
                webstreamer = new WebStreamer();
                await webstreamer.initialize({user:"abc"})
            }
        });

        after(async () => {
            assert.isObject( webstreamer )
            await webstreamer.terminate()
        });

        it(`version`, async () => {
            assert.isString( webstreamer.version())
        });
    });


});

