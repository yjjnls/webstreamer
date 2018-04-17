const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');

describe('WebStreamer', function () {
    describe('#interface', function () {
        before(async () => {
            await plugin.Initialize();
        });

        after(async () => {
            await plugin.Terminate();
        });

        it(`version`, async () => {
            assert.isString(plugin.Version());
        });
    });
});
