const chai = require('chai');
let expect = chai.expect,
    assert = chai.assert;

describe('Array', function () {
   describe('#indexOf()', function () {
       beforeEach(function () {
           console.log('Before #indexOf test');
       });
       it('should return -1 when the value is not present', function () {
           assert.equal([1,2,3].indexOf(4), -1);
       });
   });
});


//asynchronous code
describe('Asynchronous test', function () {
   describe('#async()', function () {
       it('should run without error', function (done) {
           setTimeout( () => {
               done();
           }, 1000);
       });
   });
});


//async/await
describe('Async/await test', function () {
    beforeEach(async function () {
        await db.clear();
        await db.save([tobi, loki, jane]);
    });
    describe('#find()', function () {
        it('responds with matching records', async function () {
            const users = await db.find({type: 'User'});
            users.should.have.length(3);
        })
    });
});

// HOOKS
describe('hooks', function() {

    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases
});