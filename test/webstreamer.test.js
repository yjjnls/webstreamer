/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const WebStreamer = require('../index').WebStreamer;
const WS = require('../index')

describe('WebStreamer', function () {

    describe('#interface', function () {
        let webstreamer = undefined;

        before(async () => {
            await WS.Initialize({user:"abc"})
        });

        after(async () => {
            await WS.Terminate()
        });

        it(`version`, async () => {
            assert.isString( WS.Version())
        });
    });


});

