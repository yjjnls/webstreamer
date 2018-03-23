

class IProcessor  {

    constructor(webstreamer,name) {
        this.name = name
        this.webstreamer = webstreamer
        this.options = null;
    }

    async initialize(options) {

        //create processor (pipe of gstreamer)
        if( ! this.type ){
            return this.failure("initialize failed because type not specified.")
        }

        await this.call({action : 'processor.create',
            type : this.type,
            name : this.name })

        await this.call({action : 'processor.initialize',
            name : this.name })

    }

    async terminate() {

        await this.call({action : 'processor.destroy',
            name : this.name })
    }

    failure(message){
        return new Promise(function (resolve, reject) {
            reject({
                name: this.name,
                message: message
            })
        })
    }


    call( param ){
        return this.webstreamer.call_(JSON.stringify(param))
    }
}


module.exports = {
    IProcessor : IProcessor
};