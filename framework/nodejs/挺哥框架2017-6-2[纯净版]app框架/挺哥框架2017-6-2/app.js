/**
 * Created by yhysj16 on 16/1/19.
 */
var co = require('co');
var bin = {
    post:function(Route,Auth,Arg,Fun)
    {
        try
        {

            bin[Route]={};
            bin[Route].F=function(_arg){

                if(_arg.res!=undefined)
                {
                    _arg.retJSON=function(ret)
                    {
                        _arg.res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
                        _arg.res.write(ret);
                        _arg.res.end();
                    }
                }
                co(Fun(_arg))
            };
            bin[Route].A=Arg;
            if(Auth.auth)
            {
                bin[Route].S=Auth.auth;
                bin[Route].P=Auth.index;
            }
        }
        catch(e)
        {
            console.log(e);
        }


        // obj();
    },
    get:function(Route,Auth,Arg,Fun)
    {
        try
        {
            bin[Route]={};
            bin[Route].F=function(_arg){
                if(_arg.res!=undefined)
                {
                    _arg.retHTML=function(ret)
                    {
                        _arg.res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                        _arg.res.write(ret);
                        _arg.res.end();
                    }
                }
                co(Fun(_arg));
            };
            bin[Route].A=Arg;

            if(Auth.auth)
            {
                bin[Route].S=Auth.auth;
                bin[Route].P=Auth.index;
            }
        }
        catch(e)
        {
            console.log(e);
        }


        // obj();
    },
    fun:function(Route,Auth,Arg,Fun)
    {
        try
        {
            bin[Route]={};
            bin[Route].F=function(_arg){
                if(_arg.res!=undefined)
                {
                    _arg.retJSON=function(ret)
                    {
                        _arg.res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                        _arg.res.write(ret);
                        _arg.res.end();
                    }

                }
                co(Fun(_arg))
            };
        }
        catch(e)
        {
            console.log(e);
        }


        // obj();
    },
    verify:function(type,s, e) {
        var zz = {
            All: new RegExp("^(.){" + s + "," + e + "}$"),//限制数据长度
            Name: new RegExp("^([\u4e00-\u9fa5]){" + s + "," + e + "}$"),//验证中文“姓名”
            Phone: /^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/,//验证手机号
            User:new RegExp("^([a-zA-Z]|[a-zA-Z0-9_]){" + s + "," + e + "}$"),//验证“用户名”字母开头，允许字母数字下划线
            path:new RegExp("^([a-zA-Z\/]|[a-zA-Z0-9_\/]){" + s + "," + e + "}$"),
            Users:new RegExp("^([a-zA-Z\n]|[a-zA-Z0-9\n]){" + s + "," + e + "}$"),//验证“用户名”字母开头，允许字母数字下划线
            Email:new RegExp("^(w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*){" + s + "," + e + "}$"), //验证“邮箱”
            //  Url:new RegExp("^(http://([w-]+.)+[w-]+(/[w- ./?%&=]*)?){" + s + "," + e + "}$"), //验证“链接”
            Nick:new RegExp("^([a-zA-Z]|[a-zA-Z0-9_]|[\u4e00-\u9fa5]){" + s + "," + e + "}$"),//验证“昵称”
            Password:new RegExp("^([a-zA-Z]|[a-zA-Z0-9_]){" + s + "," + e + "}$"),//验证“昵称”
            Fix:new RegExp("^([0-9]{7,8})|([0-9]{3,4}-[0-9]{7,8})|([0-9]{3,4}-[0-9]{7,8}-[0-9]{3,4})$"),//验证“昵称”|(\d{3,4}-\d{7,8}(-\d{3,4}))
            Int:new RegExp("0|(([1-9][0-9]*){" + s + "," + e + "})$"),//不以0开头的数值
            Y:new RegExp("^([1-9][0-9][0-9][0-9]){" + s + "," + e + "}$"),
            M:new RegExp("^(0|[1-9][0-9]*){" + s + "," + e + "}$"),
            D:new RegExp("^(0|[1-9][0-9]*){" + s + "," + e + "}$")
        };
        return zz[type];
    },
    val_isnull:function(obj){
        if(obj==null || obj=="null" || obj=="" || typeof(obj) == undefined || typeof(obj) == "undefined" || typeof(obj) == null || typeof(obj) == "null"){
            return false;
        }else{
            return true;
        }
    }
}
module.exports  = bin;

