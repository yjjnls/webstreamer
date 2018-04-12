/**
 * Created by Ganchao on 2018/2/2.
 */

const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

const WebStreamer = require('../index').WebStreamer;
const WS = require('../index');

describe('WebStreamer', function () {

  describe('#interface', function () {
      let webstreamer = undefined;

     beforeEach(async () => {
          await WS.Initialize({user:"abc"})
      });

     afterEach(async () => {
          await WS.Terminate()
      });

     it(`version`, async () => {
          assert.isString( WS.Version())
      });

      it(`version1`, async () => {
        assert.isString( WS.Version())
    });

    it(`version2`, async () => {
        assert.isString( WS.Version())
    });

  });
})
