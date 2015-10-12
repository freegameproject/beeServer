module.exports.run = function(req,res){
    //var r=JSON.stringify(req,null, 4);
    var url=req.url;
    var headers=req.headers;
    var ua=headers['user-agent'];
    setValue({ua:ua,req:url});
}