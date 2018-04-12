


//Parse time string to ms
function parseTime (str){ 
    var reg = /^(\d{2}):(\d{2}):(\d{2}).(\d{3})$/; 
    var r = str.match(reg); 
    if( !r ) return;
    const Factor =[60*60*1000,60*1000,1000,1]
    var ms =0;
    Factor.forEach((factor,i) =>{
        ms +=  parseInt(r[i+1]) *factor;
    })
    return ms;
}


function rmdirSync (targetPath) {
    try{
        let files = [];
        if( fs.existsSync(targetPath) ) {
            files = fs.readdirSync(targetPath);
            files.forEach(function(file,index){
                let curPath = targetPath + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    if(!rmdirsSync(curPath)) return false;
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(targetPath);
        }
    }catch(e){
        log.error("remove director fail! path=" + targetPath + " errorMsg:" + e);
        return false;
    }
    return true;
};