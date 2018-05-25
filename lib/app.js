const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

class IApp extends EventEmitter {

    constructor(webstreamer, name, typename) {
        assert(webstreamer);
        assert(name);
        assert(typename);
        var uname = `${name}@${typename}`;

        if (webstreamer.apps_[uname]) {
            throw {
                name: 'AppCreate',
                message: `create repeated application :${uname}`
            };
        }
        super();
        this.name = name;
        this.webstreamer = webstreamer;
        this.type = typename;
        this.options = null;

    }

    async initialize(options) {

        if (!this.type) {
            return this.failure('initialize failed because type not specified.');
        }

        await this.call('create', options);

    }

    async terminate() {
        await this.call('destroy');
    }

    reject(message) {
        return new Promise(function (resolve, reject) {
            reject({
                name: this.name,
                type: this.type,
                message: message
            });
        });
    }

    call(action, obj) {
        var event = {
            name: this.name,
            type: this.type,
            action: action,
        };

        var data = undefined;
        if (obj) {
            data = Buffer.from(JSON.stringify(obj), 'utf8');
        }
        var meta = Buffer.from(JSON.stringify(event), 'utf8');
        var self = this;
        return new Promise(function (resolve, reject) {
            self.webstreamer.call_(data, meta).then(value => {
                if (value === undefined) {
                    resolve();
                } else {
                    var data = value.toString();
                    if (data.length <= 0) {
                        resolve();
                    } else {
                        var obj = JSON.parse(data);
                        resolve(obj);
                    }
                }
            }).catch(err => {
                var msg = {
                    type: 'call',
                    message: `${action} failed.`
                };

                if (err) {
                    console.log(err.toString());
                    msg = JSON.parse(err.toString('utf8'));
                }
                reject(msg);
            });
        });
    }

}


module.exports = {
    IProcessor: IApp,
    IApp: IApp
};