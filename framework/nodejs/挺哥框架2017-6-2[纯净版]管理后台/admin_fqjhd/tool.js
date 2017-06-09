/**
 * Created by Exception on 2016/11/7.
 */
/* 工具js文件，用于存储一些公用的js */
var redis = require("redis"),redisclient = redis.createClient();
var ejs = require('ejs');
var jwt = require('jwt-simple');
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
        var token = jwt.encode(ed, "fqjhd_admin2017-2027");
        res.setHeader("Set-Cookie", ["fqjhd_admin="+token+""]);
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
    }
}
module.exports  = bin;