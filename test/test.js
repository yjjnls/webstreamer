'use strict';
var path = require('path');
var Promise = require('bluebird');
var dir = path.resolve(__dirname);
var spawn = require('child_process').spawn;

var fs = Promise.promisifyAll(require('fs'));
let mocha_command = dir + '/../node_modules/.bin/mocha';

let internal_test_file = [
    'test/videotestsrc.test.js',
    'test/audiotestsrc.test.js'
];

async function mocha_test(file) {
    const OPTIONS = {
        'test/videotestsrc.test.js': '-t 5000'
    };

    var options = '';
    if (OPTIONS[file]) {
        options = OPTIONS[file];
    }

    let args = `${file} -c ${options}`;

    spawn(mocha_command, [args], {
        stdio: 'inherit',
        shell: true
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
                let fname = 'test/' + filedir.substr(dir.length + 1);
                if (fname != 'test/test.js' &&
                    internal_test_file.indexOf(fname) == -1) {
                    await mocha_test(fname);
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
        await mocha_test(file);
    } catch (error) {
        throw new Error(error);
    }
}

if (process.argv[2] == '--internal') {
    internal_test_file.forEach((value) => {
        test_single_file(value);
    });
    return;
}

var test_file = process.argv[2];

if (test_file) {
    test_single_file(test_file);
} else {
    test(dir);
}