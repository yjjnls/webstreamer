const Plugin = require('node-plugin').Plugin;
const process = require('process');
var events = require('events');
var EventEmitter = new events.EventEmitter();
const liveStreamBufGenerator = require('./lib/livestream');

class WebStreamer extends EventEmitter {
    constructor( name ) {
    	super();
		this.name = name;
		this.plugin_ = new Plugin(name)		
    }

    initialize(options) {
		this.plugin_.initialize(options,this.on_notify_);
        this.plugin_.on('notify', this.on_notify_);
	}

	on_notify_(buf){
		console.log(buf.toString());
	}

	terminate(){
		return this.plugin_.terminate();
	}

	call_(buf){
		return this.plugin_.call(buf);
	}

}



//example = path.join(__dirname,'/bin/calc'+_EXT)
module.exports = {
	WebStreamer  : WebStreamer,
    liveStreamBufGenerator,
};



//const Plugin = require('node-plugin').Plugin

