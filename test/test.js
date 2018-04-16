var path = require('path');
var child_process = require('child_process');
var Promise = require('bluebird');
var dir = path.resolve(__dirname);

var fs = Promise.promisifyAll(require('fs'));
let command_prefix = dir + '/../node_modules/.bin/mocha ';

// function sleep(ms) {
//     return new Promise(resolve => {
//         setTimeout(resolve, ms);
//     });
// }
async function mocha_test(file) {
    let command = command_prefix + file + ' -c';
    return new Promise(function (resolve, reject) {
        child_process.exec(command, function (error, stdout, stderr) {
            if (error) {
                reject(`[mocha test] ${error}\n${stdout}`);
            }
            resolve([stdout, stderr]);
        });
    });
}

async function test(filePath) {
    try {
        let files = await fs.readdirAsync(filePath)
            .then(res => { return res; })
            .catch(err => { throw new Error(err.message); });
        for (var i = 0; i < files.length; ++i) {
            var filedir = path.join(filePath, files[i]);
            let status = await fs.statAsync(filedir)
                .then(res => { return res; })
                .catch(err => { throw new Error(err.message); });
            if (status.isFile()) {
                let fname = filedir.substr(dir.length + 1);
                if (fname != 'test.js') {
                    let res = await mocha_test('test/' + fname);
                    console.log(res[0]);
                    // console.error(res[1]);
                }
            }
            if (status.isDirectory()) {
                test(filedir);
            }
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function test_single_file(file) {
    try {
        let res = await mocha_test(test_file);
        console.log(res[0]);
        console.log(res[1]);
    } catch (error) {
        throw new Error(error);
    }

}
var test_file = process.argv[2];
if (test_file) {
    test_single_file(test_file);

}
else {
    test(dir);
}