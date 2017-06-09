/**
 * Created by yhysj16 on 16/1/19.
 */
var co = require('co');
var db=require('mongodb');
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
                        _arg.res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
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
    },
    /**
     * 判断后台设置维护通知
     */
    _wh:function (client,backcall) {
        co(function *() {
            var iswh = false;
            var foot = client.collection('index_foot');
            var a = yield foot.findOne({},{_id:1,iswh:1,whtime:1});
            if(a.iswh){
                if(a.iswh == "1"){
                    iswh = a.whtime;
                }else if(a.iswh == "0"){
                    iswh = false;
                }

            }else{
                iswh = false;
            }
            backcall(iswh);
        });
    },
    /**
     * 根据控销查询分类
     */
    _fl_kx:function (client,id,backcall){
        co(function *() {
            /*查询经验范围*/
            var dd = new Array();
            if(bin.val_isnull(id)){
                var user = client.collection('user');
                var u = yield user.findOne({_id:db.ObjectID(id)},{"_id":1,"drug_companies":1});
                var type_id =  u.drug_companies.companies_type;

                if(typeof (type_id) != "undefined"){
                    var user_type = client.collection('user_type');
                    var u_t = user_type.aggregate({"$match":{$and:[{state:1},{$or:[{"typeid":type_id},{"erpid":type_id}]}]}},{"$group": {"_id": "$_id"}, "fl":{'$push': "$fl"}});
                    var d = yield u_t.toArray();
                    if(d.length>0){
                        for(var j=0;j<d.length;j++){
                            var fl = d[j].fl;
                            if(fl && fl.length>0){
                                for(var i=0;i<fl.length;i++){
                                    dd.push(fl[i].flguid);
                                }
                            }
                        }
                    }
                }
            }
            /*查询客户控销*/
            var pin = client.collection('control_pin');
            var cur = pin.aggregate({"$match":{"kh.userid":db.ObjectID(id),state:1}},{"$group": {"_id": "$_id"}, "fl":{'$push': "$fl"}});//, "fl":{'$push': "$fl"}, "sp":{'$push': "$sp"}
            var c = yield cur.toArray();
            var cc = new Array();
            if(c.length>0){
                for(var j=0;j<c.length;j++){
                    var fl = c[j].fl;
                    if(fl && fl.length>0){
                        for(var i=0;i<fl.length;i++){
                            cc.push(fl[i].flguid);
                        }
                    }
                }
            }
            cc.push.apply(cc, dd);
            var _h = '[';
            var collection = client.collection('spfl');
            var docs = yield collection.find({tier:'2',flguid:{$nin:cc}},{},{sort: {tier: 1}}).toArray();
            if(!bin.val_isnull(docs)){
                _h += ']';
                //console.log(_h);
            }else{
                //console.log(JSON.stringify(docs));
                var _l = docs.length;
                if(_l > 10){
                    _l = 10;
                }
                for(var i=0;i<_l;i++) {
                    if (i > 0) {
                        _h += ',';
                    }
                    _h += '{';//"icon":"/'+docs[i].imgurl+'",
                    _h += '"id":"' + docs[i].flguid + '","text": "' + docs[i].text + '","sort":' + docs[i].sort + ',"tier":' + docs[i].tier + ',"imgurl":"' + docs[i].imgurl + '","parentID":"' + docs[i].parentID + '","flzj":"' + docs[i].flzj + '","children":[';
                    var _res = yield collection.find({tier: '3',flguid:{$nin:cc}, parentID: docs[i].flguid,}, {}, {sort: {tier: 1}}).toArray();
                    if (!bin.val_isnull(_res)) {
                        _h += ']}';
                    } else {
                        //console.log(JSON.stringify(_res));
                        for (var j = 0; j < _res.length; j++) {
                            if (j > 0) {
                                _h += ',';
                            }
                            _h += '{';
                            _h += '"id":"' + _res[j].flguid + '", "text": "' + _res[j].text + '", "sort":' + _res[j].sort + ',"tier":' + _res[j].tier + ',"imgurl":"' + _res[j].imgurl + '","parentID":"' + _res[j].parentID + '","flzj":"' + _res[j].flzj + '","children":[';
                            var _ref = yield collection.find({tier: '4',flguid:{$nin:cc}, parentID: _res[j].flguid}, {}, {sort: {tier: 1}}).toArray();
                            //console.log(_ref);
                            if (!bin.val_isnull(_ref)) {
                                _h += ']}';
                            } else {
                                for (var k = 0; k < _ref.length; k++) {
                                    if (k > 0) {
                                        _h += ',';
                                    }
                                    _h += '{';
                                    _h += '"id":"' + _ref[k].flguid + '", "text": "' + _ref[k].text + '","sort":' + _ref[k].sort + ',"tier":' + _ref[k].tier + ',"imgurl":"' + _ref[k].imgurl + '","parentID":"' + _ref[k].parentID + '","flzj":"' + _ref[k].flzj + '"';
                                    _h += '}';
                                }
                                _h += ']';
                                _h += '}';
                            }
                        }
                        _h += ']';
                        _h += '}';
                    }
                }
            }
            _h += ']';
            backcall(_h);
        })
    }
}
module.exports  = bin;

