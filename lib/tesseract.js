const Plugin = require('node-plugin').Plugin;
const _EXT = require('node-plugin').DYNAMIC_MODULE_SUFFIX;

var os = require('os');
var fs = require('fs');

var Promise = require('bluebird');
const EventEmitter = require('events').EventEmitter;

var tesseract_plugin = null;
// function gstreamer_paths() {

//     var name = null;
//     var default_root = null;
//     var platform = os.platform();
//     var arch = os.arch();

//     switch (platform) {
//         case 'win32':
//             default_root = 'c:/gstreamer/1.0';
//             break;
//         default:
//             // console.log(`${platform} platform not support!`);
//             return undefined;
//     }

//     switch (arch) {
//         case 'x64':
//             name = 'GSTREAMER_1_0_ROOT_X86_64';
//             default_root += '/x86_64';
//             break;
//         default:
//             // console.log( arch ," arch not support!");
//             return undefined;
//     }

//     var root = process.env[name];
//     if (!root) {
//         root = default_root;
//     }

//     var inspect = null;
//     var bin = root;

//     if (platform === 'win32') {
//         inspect = root + '\\bin\\gst-inspect-1.0.exe';
//         bin = root + '\\bin;';
//     }

//     if (!fs.existsSync(inspect)) {
//         // console.log("gstreamer installation may not correctlly in ",root);
//         return undefined;
//     }
//     return { 'root': root, 'bin': bin };

//     /*  process.env.PATH= bin + process.env.PATH
//         const { spawn } = require('child_process');
//         const ls = spawn('gst-inspect-1.0', ['--version']);
//         ls.stdout.on('data', (data) => {
//         console.log(`stdout: ${data}`);
//         });
    
//         ls.stderr.on('data', (data) => {
//         console.log(`stderr: ${data}`);
//         });
    
//         ls.on('close', (code) => {
//         console.log(`child process exited with code ${code}`);
//         });*/
// }


class Tesseract extends EventEmitter {
    constructor() {
        super();
        // this.name = 'webstreamer';
        // this.option = {
        //     rtsp_server: {
        //         max_sessions: 100,
        //         port: 554
        //         // onvif_port: 555
        //     }
        // }
        // this.apps_ = {};
    }
    initialize() {
        // var gstpath = gstreamer_paths();
        // if (gstpath === undefined) {
        //     return new Promise(function (resolve, reject) {
        //         reject({
        //             type: 'initialize',
        //             message: 'GStreamer can not be found.'
        //         });
        //     });
        // }

        if (!process.env.TESSERACT_PLUGIN_PATH) {
            return new Promise(function (resolve, reject) {
                reject({
                    type: 'initialize',
                    message: 'envirment var TESSERACT_PLUGIN_PATH not set.'
                });
            });
        }

        var directory = process.env.TESSERACT_PLUGIN_PATH;

        let prefix = '';
        if (os.platform == 'linux')
            prefix = 'lib';

        var path = directory + prefix + 'tesseract-plugin' + _EXT;

        if (!fs.existsSync(path)) {
            return new Promise(function (resolve, reject) {
                reject({
                    type: 'initialize',
                    message: path + ' not exists.'
                });
            });
        }
        let self = this;

        // this.plugin_ = new Plugin('converter', 'C:\\Users\\yuanjunjie\\Desktop\\tesseract-node\\node_modules\\node-plugin\\bin\\win\\x64', (data, meta) => {
        
        this.plugin_ = new Plugin(prefix + 'tesseract-plugin', directory, (data, meta) => {

            var m = JSON.parse(meta.toString('utf8'));
            self.emit(m.topic, data, meta);
        });

        // process.env.PATH = gstpath.bin + process.env.PATH;
        return this.plugin_.initialize();
    }

    terminate() {
        return this.plugin_.terminate();
    }

    call(data, meta) {
        return this.plugin_.call(data, meta);
    }

    version() {
        return this.plugin_.version;
    }


}

// async function Initialize() {
//     if (tesseract_plugin) {
//         throw new Error('tesseract_plugin has been initialized once!');
//     }
//     tesseract_plugin = new Tesseract();

//     return tesseract_plugin.initialize();
// }
// async function Terminate() {
//     if (!tesseract_plugin) {
//         return;
//     }

//     return new Promise(function (resolve, reject) {
//         tesseract_plugin.terminate()
//             .then(data => {
//                 resolve(data);

//             })
//             .catch(err => {
//                 reject(err);
//             });
//     });
// }

// async function OCR(meta, data) {
//     if (!tesseract_plugin) {
//         return;
//     }
//     return tesseract_plugin.call(data, meta);
// }

module.exports = {
    Tesseract
};

// async function test() {
//     try {
//         await Initialize();
//         await Terminate();
//     }
//     catch (err) {
//         console.log('error: ' + err)
//     }
// }

// test();