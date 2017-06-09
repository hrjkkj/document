var PORT = 41234;
var entrydir = "fqjhd/static";
var entryName = "fqjhd" ;//项目名称
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
var crypto = require('crypto');
var co = require('co');
/* start ============= 路径全局变量 ========== */
var command_path = "./command";
var command_path1 = "/command";
/* end ============= 路径全局变量 ==========*/


/* start ============= 生成文件 =========== */
var dir=__dirname+"/Template/";
var files_ut=[];


var fs = require('fs');
var jsdom = require("jsdom");
var minify = require('html-minifier').minify;


function createDir(dir)
{

    var list=[];
    var files = fs.readdirSync(dir);
    files.forEach(function (filename) {
        var hz=filename.split(".")

        if(hz[1]!=undefined&&hz[1]=="html")
        {
            var fullname = dir+filename;
            var stat = fs.statSync(fullname);
            var mt=new Date(stat.mtime);
            list[hz[0]]=mt.getTime();
        }

    });
    return list;
}

var files_ut=createDir(dir);

//files_ut = "";

//console.log(files_ut)




setInterval(function () {

    var tt=createDir(dir);
    for(var i in tt)
    {
        if(files_ut[i]==undefined)
        {
            files_ut[i]=tt[i];
            console.log("创建生成页面"+i)
            cym(dir,i,".html")
            //创建生成页面
        }
        else
        {
            //console.log(tt[i]+">"+files_ut[i])
            if(tt[i]>files_ut[i])
            {
                files_ut[i]=tt[i];
                console.log("创建生成页面"+i)
                cym(dir,i,".html")
                //创建生成页面
            }
        }
    }
    //console.log(createDir(dir))

},3000);



function cym(dir,name,hz)
{
    var order=name+hz;
    var order__=name;
    var reg = new RegExp("(//"+order+"[^//"+order+"]([\\s\\S]*?)//"+order+"\r\n)");
    var kkt=fs.readFileSync(__dirname+'/web/js/main.js', 'utf8');




    var regcss = new RegExp("(\\/\\*"+order+"\\*\\/[^\\/\\*"+order+"\\*\\/]([\\s\\S]*?)\\/\\*"+order+"\\*\\/\r\n)");
    var kktcss=fs.readFileSync(__dirname+'/web/js/css.js', 'utf8');
    var sz=getFile(order__,dir+name+hz);
    var writeRET=sz[0];
    var writeCSS=sz[1];


    console.log("["+reg.test(kkt)+"]");
    if(reg.test(kkt))
    {
        kkt = kkt.replace(reg,'//'+order+"\r\n"+writeRET+"\r\n//"+order+"\r\n");
        fs.writeFileSync(__dirname+'/web/js/main.js', kkt, 'utf8');
    }
    else
    {
        fs.appendFileSync(__dirname+'/web/js/main.js', '//'+order+"\r\n"+writeRET+"\r\n//"+order+"\r\n", 'utf8');
    }
    //console.log(regcss);
    //console.log(kktcss);
    //console.log("["+regcss.test(kktcss)+"]");
    if(regcss.test(kktcss))
    {
        kktcss = kktcss.replace(regcss,'/\*'+order+"\*/\r\n"+"css+='"+writeCSS+"';"+"\r\n/\*"+order+"\*/\r\n");
        fs.writeFileSync(__dirname+'/web/js/css.js', kktcss, 'utf8');
    }
    else
    {
        fs.appendFileSync(__dirname+'/web/js/css.js', '/\*'+order+"\*/\r\n"+"css+='"+writeCSS+"';"+"\r\n/\*"+order+"\*/\r\n", 'utf8');
    }
}

function getFile(order__,path){
    var contentText = fs.readFileSync(path,'utf-8');

    //过滤HTML的空格注释为一行
    var result = minify(contentText, {
        removeComments:true,
        collapseWhitespace:true,
        minifyJS:true,
        minifyCSS:true
    });
    //加载HTML文档，当过滤掉空格与注释，才能正确处理dom对象

    console.log(result)
    var document = jsdom.jsdom(result);

    var window=document.defaultView;
    var orderObj=window[order__];

    console.log(order__)
    console.log(orderObj)
    orderObj=(orderObj==undefined?{}:orderObj);


    var CSS  = document.getElementById("CSS");
    var writeCSS="";
    if(CSS!=null||CSS!=undefined)
    {
        //console.log(1232);
        //console.log(CSS.innerHTML);//在这里先把所有CSS放在CSS.css里，然后再次对CSS.css进行压缩，再把内容提到CSS.js里，当然也可以直接放进main.js
        writeCSS=CSS.innerHTML;
    }

    var page=document.querySelectorAll('[rude="page"]');
    var page__="";
    if(page!=null&&page[0]!=null)
    {
        page__=page[0].outerHTML;
    }
    else
    {
        page__='<div rude="page" id="iscroll_'+order__+'" style="width:640px;overflow:hidden;"><div style="width:640px;height:auto;"></div></div>';
    }



    //orderObj.HTMLFragment=(orderObj.HTMLFragment==undefined?"":orderObj.HTMLFragment);
    orderObj.ID=(orderObj.ID==undefined?order__:orderObj.ID);
    orderObj.W=(orderObj.W==undefined?false:orderObj.W);
    orderObj.P=(orderObj.P==undefined?"":orderObj.P);
    orderObj.L=(orderObj.L==undefined?{}:orderObj.L);
    orderObj.H=(orderObj.H==undefined?0:orderObj.H);
    orderObj.Init=(typeof orderObj.Init=="function"?orderObj.Init:function(){});
    orderObj._Init=(typeof orderObj._Init=="function"?orderObj._Init:function(){});
    orderObj.Logout=(typeof orderObj.Logout=="function"?orderObj.Logout:function(){});



    var writeRET=JSON.stringify(orderObj);
    writeRET="var "+order__+"="+writeRET;

    var header=document.querySelectorAll('[rude="header"]');
    if(header!=null&&header[0]!=null)
    {
        writeRET="var "+order__+"T='"+header[0].outerHTML+"';\r\n"+writeRET;
    }
    else
    {
        writeRET="var "+order__+"T='';\r\n"+writeRET;
    }

    var footer=document.querySelectorAll('[rude="footer"]');
    if(footer!=null&&footer[0]!=null)
    {
        writeRET="var "+order__+"B='"+footer[0].outerHTML+"';\r\n"+writeRET;
    }
    else
    {
        writeRET="var "+order__+"B='';\r\n"+writeRET;
    }

    writeRET=writeRET.substr(0,writeRET.length-1);
    for(var fun in orderObj)
    {
        if(typeof orderObj[fun]=="function")
        {
            //console.log(fun)
            writeRET+=","+fun+":"+orderObj[fun].toString();
        }
    }
    writeRET+=","+"HTMLFragment"+":'"+page__+"'";
    //orderObj.HTMLFragment=(orderObj.HTMLFragment==undefined?"":orderObj.HTMLFragment);
    writeRET+="}";


    //  console.log(writeRET)
    // console.log(writeRET)
    // var pEaafl = document.getElementById("cc");

    // var aaa=document.querySelectorAll('[rude="popup"]');
    // console.log(aaa[0].outerHTML)
    //if(pEaafl!=null)
    //{
    //  console.log(pEaafl.innerHTML);
    //  console.log(item);
    // }
    return [writeRET,writeCSS];
}
/* end ============= 生成文件 =========== */

/* start ============= 引入文件 ==========*/

var app = require("./app");
/* end ============= 引入文件 ==========*/

/* start ============== 定时器 ===============*/
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 33;
/* end ============== 定时器 ===============*/

/* start ================= ejs 渲染 ======================*/
var dirList = fs.readdirSync("/dj/"+entrydir);
dirList.forEach(function(item){
    var contentText = fs.readFileSync('/dj/'+entrydir+'/' + item,'utf-8');
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
    pwd += command_path1+"/"+filename;
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
    var Cookies={};
    var rhc=req.headers.cookie;
    if(rhc!=undefined) {
        rhc.split(';').forEach(function (Cookie) {
            var parts = Cookie.split('=');
            Cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
        if(Cookies["lhyy"]==undefined)
        {
            tool.getToken(res,req);
        }
    }
    else
    {
        tool.getToken(res,req);
    }
    if(req.method == 'POST') {
        PF.F({req:req,res:res,fields:fields, files:files,client:client,reply:reply});
    }
    else
    {
        redisclient.get(entryName+"_data",function(err, data){
            var ret= fs.readFileSync('/dj/'+entrydir+'/' + order,'utf-8');
            PF.F({req:req,res:res,fields:fields, files:files,client:client,reply:reply,ejs:ejs,ret:ret,fl:data});
        });
    }
}
/* end ============= 执行的函数 ==================*/
/* start ============= 数据库配置 ====================== */
var urla = "mongodb://fqjhd:ta52d14y9@127.0.0.1:27017/fqjhd";
/* end ============= 数据库配置 ====================== */

MongoClient.connect(urla,function(err, client) {
    console.log(err);
    var j = schedule.scheduleJob(rule, function(){
        //Route["TGWX"]("", "", "","", client);
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
                    var PF=app[order];
                    console.log("发送请求类型:"+req.method.toLowerCase());
                    //=================微信=====================
                    if(tool.validateToken(req))
                    {
                        tool.openWX(res,fields,req,url,querystring,client,app,parseString);
                        return false;
                    }
                    //=================微信=====================
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
                        var jmt="";
                        var Cookies = tool.returnCookie(req);

                        if(Cookies.fqjhd_KH){
                            jmt = decodeURIComponent(tool.DecodeCookie(Cookies.fqjhd_KH));
                            redisclient.get(jmt, function (err, reply) {
                                if(err||reply==null||reply==undefined)
                                {
                                    all(order,PF,req,res,fields, files,client,"{}",ejs,"");
                                    console.log("== 4 ==");
                                }
                                else
                                {
                                    console.log("== 3 ==");
                                    all(order,PF,req,res,fields, files,client,reply,ejs,"");
                                }
                            });
                        }else{
                            all(order,PF,req,res,fields, files,client,"{}",ejs,"");
                            console.log("== 5 ==");
                        }

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















