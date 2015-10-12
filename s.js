var http = require('http');
var net = require('net');
var url = require('url');
var fs = require('fs');
MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
mongoUrl = 'mongodb://localhost:27017/c';
//config begin
var port=10000;
//config end
insertDocument = function(db,table,obj,callback) {
   db.collection(table).insertOne(obj, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback(result);
  });
};

findOne = function(db,table,obj,callback) {
	db.collection(table).find(obj).toArray(function (err, docs) {
        if(docs[0]==undefined){
            callback('err',docs[0]);
        }else{
            callback(false,docs[0]);
        }             
    });
};

findRestaurants = function(db,table,obj,callback) {
    //var cursor =db.collection(table).find(obj);

	db.collection(table).find(obj).toArray(function (err, docs) {
        callback(docs);                        
    });
	/*
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         //console.dir(doc);
         
      } else {
         
      }

   });
*/
};

updateRestaurantsOne = function(db,table,id,obj,callback) {
   db.collection(table).updateOne(
   { _id: id },
   {
     $currentDate: {
        lastModified: true,
        "cancellation.date": { $type: "timestamp" }
     },
     $set: obj
   }, function(err, results) {
      console.log(results);
      callback();
   });
};

updateRestaurantsAll = function(db,table,query,obj,callback) {
   db.collection(table).updateOne(
   query,
   {
     $currentDate: {
        lastModified: true,
        "cancellation.date": { $type: "timestamp" }
     },
     $set: obj
   }, function(err, results) {
      console.log(results);
      callback();
   });
};

removeRestaurants = function(db,table,obj,callback) {
   db.collection(table).deleteMany(
      obj,
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};
var server = http.createServer(function (req, res) {
    //增加渲染方法
    res.r=function(value_obj){
        console.log(res.d);
        for(var key in value_obj){
            res.d=res.d.toString().replace('{{'+key+'}}',value_obj[key]);
        }
        res.write(res.d);
        res.end();
    }
    res.re=function(res,err){
        res.write('error:'+err);
        res.end();
    }
    //增加渲染结束
    var view=req.url.split('/')[1].split('?')[0];//视图和控制器
    var headerType='text/html';//默认是网页
    console.log('view:'+view);
    var file='view/'+view+'.html';
    switch (view){
        case 'blog':
            break;
        case '':
            view='index';
            file='view/index.html';
            break;
        case '/':
            view='index';
            file='view/index.html';
            break;
        case 'static':
            var tmp_arr=req.url.split('.');
            var ext_name=tmp_arr[tmp_arr.length-1];
            console.log('ext_name:'+ext_name);
            switch (ext_name){
                case 'css':
                    headerType='text/css';
                    break;
                case 'js':
                    headerType='text/javascript';
                    break;
                case 'json':
                    headerType='application/json';
                    break;
                case 'pdf':
                    headerType='application/pdf';
                    break;
                case 'json':
                    headerType='application/json';
                    break;
                case 'txt':
                    headerType='text/plain';
                    break;
                case 'json':
                    headerType='application/json';
                    break;
                case 'zip':
                    headerType='application/zip';
                    break;
                case 'rar':
                    headerType='application/rar';
                    break;
                case 'mp4':
                    headerType='audio/mpeg';
                    break;
                case 'xml':
                    headerType='text/xml';
                    break;
                case 'jpg':
                    headerType='image/jpeg';
                    break;
                case 'png':
                    headerType='image/png';
                    break;
                case 'gif':
                    headerType='image/gif';
                    break;
                default:
                    headerType='text/html';
                    break;
            }
            console.log(req.url);
            file='static/'+req.url.replace('/static','');
            break;
        default:
            view='404';
            file='view/404.html';       
    }
    console.log('header_type:'+headerType);
    console.log('file:'+file);
    var p=req.url.split('/')[1].split('?')[1];
    var q=[];//参数集
    if(p!=undefined){
        p.split('&').map(function(obj){
            var arr=obj.split('=');
            q[arr[0]]=arr[1];
        });
    }
    req.q=q;//增加参数
    console.dir(q);
    fs.readFile(file,function(err, data){
        console.dir(req.url);
        if(err){
            res.statusCode = 404;
            res.statusMessage = 'Not found';
            res.write('404');
            res.end();
            console.log('err');
        }else{ 
            res.d=data;
            res.statusCode = 200;
            res.setHeader("Content-Type",headerType);
            if(view!='static'){
                //交给控制器
                var act = require('./action/'+view);
                console.log('load action')
                act.run(req,res);
                //控制器结束
            }else{
                res.write(data);
                res.end();
            }
            //console.log(data);
            //<Buffer...
        }
    });
});
server.listen(port, '127.0.0.1');