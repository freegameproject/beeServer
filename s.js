var http = require('http');
var net = require('net');
var url = require('url');
var fs = require('fs');

//config begin
var port=10000;
//config end


var server = http.createServer(function (req, res) {
    //console.dir(req);
    /*
    res.writeHead(200, 
        {
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        }
    );
    */
    
    var view=req.url.split('/')[1].split('?')[0];//视图和控制器
    var headerType='text/html';//默认是网页
    
    
    console.log('view:'+view);
    
    
    var file='view/'+view+'.html';
    switch (view){
        case 'blog':
            break;
        case '/':
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
                    headerType='';
                    break;
            }
            
            console.log(req.url);
            file='static/'+req.url.replace('/static','');
            
            break;
        default:
            view='index';
            file='view/index.html';
            
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
            
            //var r=JSON.stringify(req,null, 4);
            
            var url=req.url;
            var headers=req.headers;
            var ua=headers['user-agent'];
            //data=data.toString().replace('{{ua}}',ua);
            //data=data.toString().replace('{{req}}',url);
            
            res.statusCode = 200;
            res.setHeader("Content-Type",headerType);
            
            res.write(data);
            //console.log(data);
            //<Buffer...
        }
        res.end();
    });
});
server.listen(port, '127.0.0.1');