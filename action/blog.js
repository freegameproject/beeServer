module.exports.run = function(req,res){
    //var r=JSON.stringify(req,null, 4);
    var url=req.url;
    var headers=req.headers;
    var ua=headers['user-agent'];
    MongoClient.connect(mongoUrl, function(err, db) {
        if(err){
            res.re(res,err);
        }else{
           var id=parseInt(req.q.id);
            
           console.log('id is:'+req.q.id);
            
	       findOne(db,'blogs',{_id:id},function(err,doc) {
               if(err){
                   res.re(res,err);
               }else{
                   res.r({ua:ua,req:url,blog_title:doc.title}); 
               }
               console.dir(doc);
               console.log('url:'+url);
               db.close();
	       });
        }
	});
}