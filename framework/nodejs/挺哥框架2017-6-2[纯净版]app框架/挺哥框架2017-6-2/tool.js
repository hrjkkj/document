/**
 * Created by Exception on 2016/11/7.
 */
/* 工具js文件，用于存储一些公用的js */
var redis = require("redis"),redisclient = redis.createClient();
var ejs = require('ejs');
var jwt = require('jwt-simple');
var url = require('url');
var crypto = require('crypto');
var bin = {
    //返回ip地址
    IP:function(req){
        var ipAddress;
        var headers = req.headers;
        var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
        forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
        if (!ipAddress) {
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    },
    //返回json格式数据
    ReturnJson:function(res,ret)
    {
        res.writeHead(200, { 'Content-Type': 'application/Json;charset=utf-8' });
        res.write(ret);
        res.end();
    },
    //出错跳转指定地址
    ReturnHtml:function(res,ret,req)
    {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.write("无法访问到当前界面");
        res.end();
    },
    getToken:function(res,req)
    {
        var ed={
            ip:bin.IP(req),
            req:req.headers["user-agent"],
            exp:(new Date()).getTime()
        };
        var token = jwt.encode(ed, "lhyy_2017-2027");
        res.setHeader("Set-Cookie", ["lhyy="+token+""]);
    },
    IP:function(req){
        var ipAddress;
        var headers = req.headers;
        var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
        forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
        if (!ipAddress) {
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    },
    //返回cookie
    returnCookie:function(req){
        var Cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
            var parts = Cookie.split('=');
            Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        return Cookies;
    },
    DecodeCookie:function(str)
    {
        var strArr;
        var strRtn="";
        strArr=str.split("a");
        for (var i=strArr.length-1;i>=0;i--)
            strRtn+=String.fromCharCode(eval(strArr[i]));
        return strRtn;
    },
    validateToken:function (req){//验证请求是否来自微信
        var query = url.parse(req.url,true).query;
        //console.log("*** URL:" + req.url);
        //console.log(query);
        var signature = query.signature;
        var echostr = query.echostr;
        var timestamp = query['timestamp'];
        var nonce = query.nonce;
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = "";//这里是你在微信开发者中心页面里填的token，而不是****
        oriArray.sort();
        var original = oriArray.join('');
        var scyptoString = bin.sha1(original);
        if(signature == scyptoString){
            return true;
        }else {
            return false;
        }
    },
    sha1:function (str) {
        var md5sum = crypto.createHash('sha1');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },
    openWX:function(res,fields,req,url,querystring,client,app,parseString)
    {
        var postdata = "";
        var hasProp=true;
        for (var prop in fields){
            hasProp = false;
            break;
        }


        var q = url.parse(req.url);
        var order=q.pathname.substr(q.pathname.lastIndexOf("/")+1);
        if(req.method != 'POST')
        {
            fields = querystring.parse(q.query);
        }

        if(hasProp&&order=="")//判断是否是微信入口
        {

            req.addListener("data",function(postchunk){
                postdata += postchunk;
            })
            //POST结束输出结果
            req.addListener("end",function(){
                //console.log(54444);
                //  console.log(postdata);
                parseString(postdata, function (err, result) {
                    fields=result.xml;
                    console.log(fields.MsgType[0]);
                    //console.log(fields);
                    var PF=app[fields.MsgType[0]];
                    // console.log(PF.F)
                    if(PF!=undefined)
                    {
                        PF.F({req:req,res:res,fields:fields,client:client});
                    }
                });
            })
            return false;

        }
        if(fields.echostr!=undefined)
        {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(fields.echostr);//params['echostr']
            res.end();
            return false;
        }
    }
}
module.exports  = bin;