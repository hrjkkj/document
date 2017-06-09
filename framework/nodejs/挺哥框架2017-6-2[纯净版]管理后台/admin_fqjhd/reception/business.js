var fs = require('fs');
var app = require("../app");
var config = require("../config");
var https = require('https');
var http = require('http');
var url = require('url');
var db=require('mongodb');
var ejs = require('ejs');
var co = require('co');
var htpath = "";

var ejspath = config.Path.ejspath;//管理ejs路径

/////////////////////////////////GET请求///////////////////////////////////////
app.get("index.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        all.path = "12345";
        all.filename=ejspath;
        var collection = arg.client.collection("test");
        var f = yield collection.find().toArray();
        all.data = f;
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});

app.get("users.html", {
    auth: false,
    index: 1,
    V: false,
    O:false,
    I:0
}, {

}, function*(arg) {
    try {
        var collection = arg.client.collection("test");
        var all = {};
        var result = yield collection.find().toArray();
        all.data = result;
        console.log(result);
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    } catch(e) {
        console.log(e);
    }

});

/////////////////////////////////POST请求///////////////////////////////////////

app.post("removeUser", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {

}, function*(arg) {
    try {
        var param = arg.fields;
        var collection =  arg.client.collection("test");
        var count = yield collection.find({username: param.username}).count();
        if(count > 0 ) {
            var afterdel = yield collection.removeOne({username: param.username});
            console.log(afterdel);
            if(afterdel.result.ok) {
                arg.retJSON("1");
            }
        } else {
            arg.retJSON("还没有 " + encodeURIComponent(param['username']) + "这个用户");
        }

    } catch (e) {
        console.log(e);
    }
})

app.post("getListMethod", {
    auth: false,
    index: 1,
    V:false,
    O:false,
    I: 0
}, {

}, function*(arg) {
    try{
        var all = {};
        var collection = arg.client.collection("test");
        var list = collection.find().toArray();
        console.log(list);
    } catch(e) {
        console.log(e);
    }

});





//==========================================调用函数===========================================
