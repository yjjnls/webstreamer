const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');

describe('WebStreamer', function () {
    describe('#interface', function () {
        before(async () => {
            try {
            await plugin.Initialize({
                    rtsp_server: {
                        port: 555
                    }
                });
        } catch (err) {
                throw new Error(err.message);
            }
        });

        after(async () => {
            await plugin.Terminate();
        });

        it(`version`, async () => {
            assert.isString(plugin.Version());
        });
    });
});
