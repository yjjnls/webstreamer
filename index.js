const Plugin = require('node-plugin').Plugin
const process = require('process')
var events = require('events');
var EventEmitter = new events.EventEmitter();

class WebStreamer extends EventEmitter {
    constructor( name ) {
    	super();
		this.name = name;
		this.plugin_ = new Plugin(name)		
    }

    initialize(options) {
		this.plugin_.initialize(options,this.on_notify_);
	}

	on_notify_(buf){
		console.log(buf.toString());
	}

	terminate(done){
		this.plugin_.release(done);
	}

	call_(buf){
		this.plugin_.call(buf,cb);
	}

}



//example = path.join(__dirname,'/bin/calc'+_EXT)
module.exports = {
	WebStreamer  : WebStreamer
};



//const Plugin = require('node-plugin').Plugin

