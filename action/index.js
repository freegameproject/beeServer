module.exports.run = function(req,res){
    //var r=JSON.stringify(req,null, 4);
    var url=req.url;
    var headers=req.headers;
    var ua=headers['user-agent'];
    res.r({ua:ua,req:url});
}