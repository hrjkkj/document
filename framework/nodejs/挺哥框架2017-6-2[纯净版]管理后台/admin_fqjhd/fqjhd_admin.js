var config = require("./config");
var PORT = config.Path.qtPORT;
var http = require('http');
var path = require('path');
var fs = require('fs');
var url=require('url');
var tool = require('./tool');
var formidable=require('formidable');
//var redis = require("redis"),redisclient = redis.createClient();
var ejs = require('ejs');
var querystring = require('querystring');
var mongo = require('mongodb');
var db=require('mongodb');
var server=db.Server;
var MongoClient = db.MongoClient;
var parseString = require('xml2js').parseString;
var redis = require("redis"),redisclient = redis.createClient();
var co = require('co');
/* start ============= 引入文件 ==========*/
var app = require("./app");
/* end ============= 引入文件 ==========*/
/* start ============= 路径全局变量 ========== */
var dir = config.Path.dir;
var entryName = config.Path.entryName;//项目名称
var command_path = config.Path.command_path;
/* end ============= 路径全局变量 ==========*/
/* start ============== 定时器 ===============*/
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 33;
/* end ============== 定时器 ===============*/

/* start ================= ejs 渲染 ======================*/
var dirList = fs.readdirSync("/dj/"+dir);
dirList.forEach(function(item){
    var contentText = fs.readFileSync('/dj/'+dir+'/' + item,'utf-8');
    redisclient.set("html_"+item,contentText);  //这里要写入相关的session最好以json方式保存,这个是管理员的登陆！
});
/* end ================= ejs 渲染 ======================*/

/* start ================ 服务 ================*/
var readDir = fs.readdirSync(command_path);
readDir.forEach(function (files) {
    try{
        require(command_path+"/"+files);
    }catch(e){
        console.log("文件："+files+"中有代码块出错，请仔细检查代码的闭合语法。"+e)
    }
});

fs.watch(command_path, function (event, filename) {
    var pwd = path.resolve();
    pwd += config.Path.command_path1+"/"+filename;
    delete require.cache[pwd];

    try{
        require(command_path+"/"+filename);
    }catch(e){
        console.log("文件："+filename+"中有代码块出错，请仔细检查代码的闭合语法。"+e)
    }
});

/* end ============= 服务 =========================*/
/* start ============= 执行的函数 ==================*/
function all(order,PF,req,res,fields, files,client,reply,ejs,V)
{
    var reply = JSON.parse(reply);
    if(V!="")
    {
        tool.ReturnHtml(res,V,req);
        return false;
    }
    if(req.method == 'POST') {
        PF.F({req:req,res:res,fields:fields, files:files,client:client,reply:reply});
    }
    else
    {
        var Cookies={};
        var rhc=req.headers.cookie;
        if(rhc!=undefined) {
            rhc.split(';').forEach(function (Cookie) {
                var parts = Cookie.split('=');
                Cookies[parts[0].trim()] = (parts[1] || '').trim();
            });
            if(Cookies["fqjhd_admin"]==undefined)
            {
                tool.getToken(res,req);
            }
        }
        else
        {
            tool.getToken(res,req);
        }
        redisclient.get(entryName+"_data",function(err, data){
            var ret= fs.readFileSync('/dj/'+dir+'/' + order,'utf-8');
            PF.F({req:req,res:res,fields:fields, files:files,client:client,reply:reply,ejs:ejs,ret:ret,fl:data});
        });
    }
}
/* end ============= 执行的函数 ==================*/
/* start ============= 数据库配置 ====================== */
var urla = config.Path.urla;
/* end ============= 数据库配置 ====================== */
MongoClient.connect(urla,function(err, client) {
    var j = schedule.scheduleJob(rule, function(){
    });

    var server = http.createServer(function (req, res) {
        //过滤指令
        if(!err)
        {
            if (req.method == 'POST'||req.method == 'GET') {
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    var q = url.parse(req.url);
                    var order=q.pathname.substr(q.pathname.lastIndexOf("/")+1);
                    if(req.method != 'POST')
                    {
                        fields = querystring.parse(q.query);
                    }
                    console.log(order);
                    if(order == "" || order == "/"){
                        order = config.Welcome.file;
                        req.method = "GET";
                    }
                    var PF=app[order];
                    console.log("发送请求类型:"+req.method.toLowerCase());
                    if(PF==undefined)
                    {
                        console.log("== 1 ==");
                        all(order,PF,req,res,fields, files,client,"{}",ejs,'{"error":"无此路由"}');
                        return false;
                    }
                    else
                    {
                        var _pf=false;
                        if(PF.V)//要验证参数
                        {
                            //验证开始
                            for(var b in PF.A){
                                if(Object.prototype.toString.call(fields[b])=="[object Array]")//若前的参数有两个相同例A=B&A=C，那么这里会变成一个数组A=[B,C]，这种情况要过滤
                                {
                                    _pf=true;//有多个相同参数
                                    break;
                                }
                                else
                                {
                                    console.log(b)
                                    if(fields[b]!=undefined)
                                    {

                                        if(!fields[b].match(PF.A[b]))//某些参数值无法通过正则验证
                                        {
                                            console.log("______2");
                                            _pf=true;
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        console.log("______3");
                                        _pf=true;
                                        break;
                                    }

                                }
                            }

                            if(PF.O&&!_pf)//验证参数通过后，要验证参数顺序
                            {

                                if(Object.keys(fields).join("") != Object.keys(PF.A).join(""))
                                {
                                    all(order,PF,req,res,fields, files,client,"{}",ejs,'{"error":"请求参数个数异常"}');
                                    return false;
                                }
                            }

                        }
                        if(_pf)
                        {
                            console.log("== 2 ==");
                            all(order,PF,req,res,fields, files,client,"{}",ejs,'{"error":"请求参数异常"}');
                            return false;
                        }
                        all(order,PF,req,res,fields, files,client,"{}",ejs,"");
                        console.log("== 5 ==");

                    }
                });
            }
        }else
        {
            tool.ReturnJson(res,'{"error":"数据库连接异常"}')
        }
    });
    server.listen(PORT);
});















