


const webstreamer = require('./index')

async function sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve();
      }, timeout);
    });
  }

async function main_rtsp_server(){
    console.log("+ webstreamer.Initialize()")
    await webstreamer.Initialize()
    console.log("- webstreamer.Initialize()")

    console.log("processing")
    rtsp = new webstreamer.RTSPTestServer("rtsptest.1")
    //rtsp.option.video.overlay['draw-shadow'] = false
    //rtsp.option.video.overlay['draw-outline'] = false
    await rtsp.initialize()
    
    await rtsp.startup()
    
    
    
    //await sleep(15*1000)
    console.log("to end")

    //await rtsp.stop()


    console.log("end")
    return


}

var IElementWatcher = require('./lib/elementwatcher')
async function main_analyzer(){
    await webstreamer.Initialize()

    console.log("processing")
    app = new webstreamer.IElementWatcher("avanalyzer.1")

    await app.initialize()
    console.log("####--------------------------")
    await app.startup()
    
    
    
    //await sleep(15*1000)
    //console.log("to end")
//
    ////await rtsp.stop()
//
//
    //console.log("end")
    return


}
async function main()
{
    return main_analyzer()
    //return main_rtsp_server()   
}
main().then(value => {
    console.log("success:",value)
}).catch(err=>{
    console.log("fail:",err)
})
console.log("...................");
