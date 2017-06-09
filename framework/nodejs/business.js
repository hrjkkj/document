var fs = require('fs');
var app = require("../app");
var config = require("../config");
var https = require('https');
var http = require('http');
var url = require('url');
var db=require('mongodb');
var ejs = require('ejs');
var co = require('co');
var redis = require("redis"),redisclient = redis.createClient();
var htpath = "";

var ejspath = config.Path.ejspath;//管理ejs路径

/////////////////////////////////GET请求///////////////////////////////////////
app.get("setting.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});

app.get("voting_preview.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});

app.get("edit_voting.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});

app.get("myaccount.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});

app.get("login.html", {
    auth: false,
    index:1,
    V:false,
    O:false,
    I:0
}, {}, function *(arg) {
    try {
        var test = arg.client.collection("test");
        var data = yield test.find().toArray();
        console.log(data);
        var retdata = {};
        retdata.data = retdata;
        var ret = arg.ejs.render(arg.ret, retdata);
        arg.retHTML(ret);
    } catch(e) {
        console.log(e)
    }
})

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

app.get("participator.html", {
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

app.get("termsofservice.html",{
    auth:false,
    index:1,
    V:false,//要验证参数
    O:false,//同时验证参数顺序
    I:0//如果要权限验证，I代表权限点，从1到无限，如果I等于0，则代表还是无权限
},{
},function*(arg){
    try{
        var all={};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
        // 跳转404
        // ejs编译错误的 时候，比如数据库没有这个字段。
        //returnErr(arg.res,arg.ejs,"login.html["+e+"]");
    }
});


app.get("activity.html", {
    auth: false,
    index: 1,
    V: false,
    O:false,
    I:0
}, {}, function*(arg){
    try {
        var collection = arg.client.collection("test");
        var all = {};
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    } catch(e) {
        console.log(e);
    }
});

app.get("voting.html", {
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
//工具类
app.post("testCookie", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function *(arg) {
    var cookie = arg.reply;
    console.log(cookie)
    arg.retJSON(JSON.stringify(cookie));
})

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

app.post("adminLoginMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function*(arg) {
    try {

    } catch(e) {
        console.log(e)
    }
})

/*
 * 创建活动
 * 创建活动的名字不能相同。（默认设置）
 * 1: 创建成功
 * 2: 活动已经存在
 * 0: 创建失败
 * 是否开启和是否删除活动是否一样？
 */
app.post("adminCreateActivityMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {},function *(arg) {
    try {
        var params = arg.fields;
        console.log(params);
        var activity = arg.client.collection("activity");
        var finded = yield activity.findOne({"activity_name" :params.activity_name});
        if(!finded) {
            var query = {
                "activity_name": params.activity_name,
                "activity_status": params.activity_status,
                "activity_theme": params.activity_theme,
                "activity_start_time": params.activity_start_time,
                "activity_finish_time": params.activity_finish_time,
                "create_time": new Date().getTime(),
                //全局设置
                // 同一个选手是否能被同时投票
                vote_twice: false,
                //是否删除活动
                isdelete:false,
                // 活动是否开启
                activity_status: params.activity_status
            }
            var result = yield activity.insertOne(query);
            console.log(result);
            if(result.result.ok) {
                setCookie(result.ops[0]._id.toString(), JSON.stringify(result.ops[0]), arg);
                arg.retJSON("1");
            }
        } else {
            arg.retJSON("2")
        }
    } catch(e) {
        console.log(e);
    }
})


/*
 * 后台登录设置
 * 以后增加功能：权限的功能，
 * 1:成功  0：失败
 */
app.post("adminLoginMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function*(arg) {
    try {
        var admin_user = arg.client.collection("user_admin");
        var params = arg.fields;
        console.log(params);
        var result = yield admin_user.findOne({"username": params.username, "password": params.password});
        if(result) {
            // 设置cookie
            setCookie(result._id.toString(), JSON.stringify(result), arg);
            arg.retJSON("1");
        } else {
            arg.retJSON("0")
        }
        console.log(params);
    } catch(e) {
        console.log(e)
    }
})

/*
 * 获得所有的 activity
 */
app.post("getActivityMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function *(arg) {
    try {
        var activity = arg.client.collection("activity");
        var result = yield activity.find().toArray();
        if(result.length > 0) {
            arg.retJSON(JSON.stringify(result));
        } else{
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * adminStopActivityMethod
 * 停止活动
 * 1: 停止成功
 * 2: 停止失败
 * 有人在同时投票，那么可能会关联到。
 */

app.post("adminStopActivityMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function *(arg) {
    try {
        var activity = arg.client.collection("activity");
        var params = arg.fields;
        var activity_id = params.activity_id;
        console.log(params);
        var result = yield activity.update({"_id": db.ObjectID(activity_id)}, {$set:{"isdelete": true}});
        if(result.result.ok) {
            arg.retJSON("1");
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * 添加活动信息
 * 2： 活动信息已经添加
 */
app.post("adminAddActivityInfoMethod", {
    auth:false,
    index:1,
    V: false,
    O: false,
    I:1
}, {}, function *(arg) {
    try {
        var activity_info = arg.client.collection("activity_info");
        var params = arg.fields;
        console.log(params);
        var finded = yield activity_info.findOne({activity_id: db.ObjectID("59350f7ab091b40d05c4d617")});
        if(finded) {
            var result = activity_info.updateOne({activity_id: db.ObjectID("59350f7ab091b40d05c4d617")});
            if(result) {
                arg.retJSON("2");
            } else {
                arg.retJSON("0");
            }
        } else {
            var result = activity_info.insertOne({
                activity_id: db.ObjectID("59350f7ab091b40d05c4d617"),
                voting_rule: params.voting_rule,
                work_requirement: params.work_requirement
            });
            if(result.result.ok) {
                arg.retJSON("1");
            } else {
                arg.retJSON("0");
            }
        }
    } catch(e) {
        console.log(e);
    }
})


//==========================================调用函数===========================================
/*setcookie
 *
 */
function setCookie(key, value, arg) {
    var today = new Date();
    var time = today.getTime() + 21600*1000;
    var time2 = new Date(time);
    var timeObj = time2.toGMTString();
    redisclient.set(key,value);
    arg.res.setHeader("Set-Cookie",'fqjhd_admin_KH='+CodeCookie(encodeURIComponent(key))+'; Expires=Wed, '+timeObj);
}

/**
 * 转化cookie
 */
function CodeCookie(str)
{
    var strRtn="";
    for (var i=str.length-1;i>=0;i--){
        strRtn+=str.charCodeAt(i);
        if (i) strRtn+="a";
    }
    return strRtn;
}

function DecodeCookie(str)
{
    var strArr;
    var strRtn="";
    strArr=str.split("a");
    for (var i=strArr.length-1;i>=0;i--){
        strRtn+=String.fromCharCode(eval(strArr[i]));
    }
    return strRtn;
}
