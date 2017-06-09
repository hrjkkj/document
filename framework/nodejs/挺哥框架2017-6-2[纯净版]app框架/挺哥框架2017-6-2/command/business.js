var fs = require('fs');
var app = require("../app");
var https = require('https');
var http = require('http');
var url = require('url');
var redis = require("redis"),redisclient = redis.createClient();
var db=require('mongodb');
var ejs = require('ejs');
var co = require('co');
var redis = require("redis");
var jwt = require('jwt-simple');


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
        var ret = arg.ejs.render(arg.ret,all);
        arg.retHTML(ret);
    }catch (e){
        console.log(e);
    }
});

/*
 * weixin
 * 2: 不是第一次登录
 */
app.get("MP_verify_3oGsBGekOfe8ukz8.txt",{
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
    }
});


app.post("setWxMethod", {
    auth: false,
    index:1,
    V:false,
    O:false,
    I:0
}, {}, function*(arg)  {
    try {
        var params = arg.fields;
        var user = arg.client.collection("user");
        var finded = yield user.findOne({"weixin.openid":params.openid});
        console.log(finded);
        if(finded) {
            var json = {
                "user_id": finded._id,
                "username": finded.username,
                "avatar": finded.avatar,
                "phone": finded.personal.phone
            }
            arg.res.setHeader("Set-Cookie",'lhyy_KH=; Expires=Wed, 13-Jan-1921 22:23:01 GMT;HttpOnly');
            setCookie(json.user_id, JSON.stringify(json), arg);
            arg.retJSON("2");
        } else {
            var query = {
                username: params.nickname || "游客",
                avatar: params.headimgurl,
                personal: {
                    name: params.nickname || "",
                    nick: params.nickname || "",
                    sex: params.sex,
                    birth: "",
                    portrait: "",
                    zip:"",
                    phone: null,
                    fix: "",
                    //可空，传参创建
                    email:  "",
                    // 可空，个人备注，传参创建
                    remark:  "",
                    prov: "",
                    city: "",
                    district: "",
                    address: "",
                    post:""
                },
                isDelete: false,
                weixin: params
            };
            var result = yield user.insertOne(query);
            if(result.result.ok) {
                var json = {
                    "user_id": result.ops[0]._id,
                    "username": result.ops[0].username,
                    "avatar": result.ops[0].avatar,
                    "phone": ""
                };
                //console.log(json);
                //设置cookie，但是没有验证手机号码
                console.log(json);
                //首先清除cookie
                arg.res.setHeader("Set-Cookie",'lhyy_KH=; Expires=Wed, 13-Jan-1921 22:23:01 GMT;HttpOnly');
                setCookie(json.user_id, JSON.stringify(json), arg);
                arg.retJSON("1")
            } else {
                arg.retJSON("0")
            }
        }
    } catch(e) {
        console.log(e);
    }
})

//======== POST ========
//删除表记录
app.post("deldb", {
    auth: false,
    index:1,
    V:false,
    O: false,
    I:0
}, {}, function*(arg) {
    try {
        var params = arg.fields;
        console.log(params);
        var collection = arg.client.collection(params.db);
        var query = {};
        console.log(db.ObjectID(params.value));
        query[params.key] = db.ObjectID(params.value);
        console.log(query);
        var result = yield collection.remove(query);
        console.log(result);
        if(result.result.ok) {
            console.log("del key success");
            arg.retJSON(JSON.stringify(result));
        }
    } catch(e) {
        console.log(e);
    }
});

/*
 * 数据库查询，test表
 * 传入key和value
 */
app.post("databaseText", {
    auth: false,
    index:1,
    V:false,
    O:false,
    I:0
}, {}, function*(arg) {
    var collection = arg.client.collection("test");
    var params = arg.fields;
    var search = {};
    search[params.key] = params.value;
    if(params.debug) {
        console.log(search);
    }
    var result = yield collection.findOne(search);
    if(app.val_isnull(result)) {
        arg.retJSON(JSON.stringify(result));
    }else{
        arg.retJSON("0");
    }
});

// 退出登录
app.post("logoutMethod", {
    auth: false,
    index:1,
    V: false,
    O: false,
    I: 0
}, {}, function*(arg) {
    try {
        // destory cookie
        //destoryCookie(arg);
        arg.res.setHeader("Set-Cookie",'lhyy_KH=; Expires=Wed, 13-Jan-1921 22:23:01 GMT;HttpOnly');
        arg.retJSON("1");
    } catch (e) {
        arg.retJSON("0");
    }
});

// 用户登录 bak
app.post("loginMethod",{
    auth: false,
    index:1,
    V: false,
    O: false,
    I: 0
}, {
    username: app.verify("All", 0, 10),
    password: app.verify("All", 0, 10),
}, function*(arg) {
    try{
        var collection = arg.client.collection("user");
        var params = arg.fields;
        var query = {
            username: params.username,
            password: params.password
        }
        //查到了值之后可以返回
        var result = yield collection.findOne(query, {"username": 1, "personal": 1,"portrait": 1 });
        if(result) {
            var json = {
                "user_id": result._id,
                "username": result.username,
                "avatar": result.personal.portrait
            };
            console.log(json);
            setCookie(result._id, JSON.stringify(json), arg);
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch (e) {
        console.log(e);
    }
});


/*
 * 用户登录 bak 这个通过短信验证，然后设置cookie
 * 登录之后用用户名或者微信名来设置cookie
 */
app.post("loginMethod",{
    auth: false,
    index:1,
    V: false,
    O: false,
    I: 0
}, {
    username: app.verify("All", 0, 10),
    password: app.verify("All", 0, 10),
}, function*(arg) {
    try{
        var collection = arg.client.collection("user");
        var params = arg.fields;
        var query = {
            username: params.username,
            password: params.password
        }
        //查到了值之后可以返回
        var result = yield collection.findOne(query, {"username": 1, "personal": 1,"portrait": 1 });
        if(result) {
            var json = {
                "user_id": result._id,
                "username": result.username,
                "avatar": result.personal.portrait
            };
            console.log(json);
            setCookie(result._id, JSON.stringify(json), arg);
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch (e) {
        console.log(e);
    }
});

/*
 * 用户注册
 *
 */
app.post("registerMethod", {
    auth: false,
    index: 1,
    V: false,
    O: false,
    I: 0
}, {

},function*(arg) {
    try {
        var params = arg.fields;
        var collection = arg.client.collection("user");
        // 删除(直接删除数据库)
        //var xx = yield collection.remove({"username": "liduanjie"}, {justOne: true});
        //arg.retJSON(JSON.stringify(xx));

        //添加 mock data
        var query = {
            username: params.username,
                password: params.password,
                personal: {
                name: params.name || "",
                nick: params.nick || "",
                sex: params.sex,
                birth: params.birth || "",
                portrait: params.portrait || "",
                zip: params.zip || "",
                phone: params.phone,
                fix: params.phone || "",
                //可空，传参创建
                email: params.email || "",
                // 可空，个人备注，传参创建
                remark: params.remark || "",
                prov: params.prov || "",
                city: params.city || "",
                district: params.district || "",
                address: params.address || "",
                post: params.post || ""
            },
            isDelete: false,
            weixin: {
                user: {
                    userid: "",
                    openid:"",
                    avatar: "./images/default.png"
                }
            }
        };
        // 传入参数调试
        //console.log(query);
        var hasUser = yield collection.find({"username": query.username}).toArray();
        if(hasUser.length > 0) {
            arg.retJSON("0");
        } else {
            var result = yield collection.insert(query);
            // 传出结果
            // conole.log(result);
            if(result) {
                arg.retJSON(JSON.stringify(result.result));
            }
        }
    } catch(e) {
        console.log(e);
    }
});


//增加疾病库(在后台加入，保存数据结构,有问题)
app.post("addDiseaseMethod", {
    auth: false,
    index: 1,
    V:false,
    O: false,
    I: 0
}, {}, function*(arg){
    try {
        var collection = arg.client.collection("diseases");
        var params = arg.fields;
        // 疾病名必须是唯一的
        var query = {
            disease_name: "胃食管反流病",
            disease_knowledge: "[疾病常识]胃食管反流病是指过多的胃、十二指肠内容物反流入食管引起的烧心、反酸、反食等症状，并可导致食管黏膜的损害以及口咽、喉等器官的组织损害。病人主要表现为反胃(空腹时反胃为酸性胃液反流，称为反酸)、烧心、胃胀、唾液分泌过多、胸痛，严重者出现下咽困难及疼痛；另有病人出现咳嗽等咽喉部症状，易与上呼吸道疾病混淆，也是支气管哮喘发病的重要原因之一；如病人并发食管溃疡可因少量出血而出现乏力、头晕等贫血症状",
            disease_tags: "胃食管反流病",
            healthInstruction: "1．适当地调整生活方式，如餐后保持直立、不穿紧身衣、抬高床头20～30厘米等。2．避免饱食，避免食入咖啡、巧克力等辛辣刺激性食物。3．避免弯腰、用力排便等增加腹压的动作，便秘者应多食蔬菜水果，保持大便通畅。",
            combinations: [
                {
                    name: "吗丁啉+雷尼替丁",
                    content: "吗丁啉能促进胃排空，减少胃反流，两者合用可有效控制症状；雷尼替丁为抗酸剂，能减少胃酸的分泌，从而减轻烧心、胸痛等胃黏膜刺激症状。此用药联合主要针对病情较轻的患者。雷尼替丁禁用于严重肾功能不全、孕妇及哺乳期妇女，肝、肾功能不全者及婴幼儿慎用。",
                    tag: "黄金搭配方案,吗丁啉,雷尼替丁",
                    isdelete: 0
                },
                {
                    name: "吗丁啉+兰索拉唑",
                    content: "吗丁啉能增加全消化道的推进性运动，增加胃肠动力，亦能增加食管下括约肌压力，故适合于反酸、反食等反流症状严重并伴有便秘的患者，兰索拉唑为另一种作用强的抑制胃酸分泌的药物，副作用少，可较长时间用药。因此，这两种药物联合适用于病情重的患者。",
                    tag: "黄金搭配方案,兰索拉唑,吗丁啉",
                    isdelete: 0
                },
                {
                    name: "胃复安+奥美拉唑",
                    content: "胃复安为胃动力药，加速胃的排空和肠内容物从十二指肠向大肠推进，优点是价格便宜。奥美拉唑亦为抗酸药，但因其作用于胃酸形成的最后环节，故其抑制胃酸分泌作用较雷尼替丁强，且作用时间长，不良反应少，适用于烧心等胃黏膜刺激症状较重的患者。对本品过敏、严重肾功能不全者以及婴幼儿禁用，严重肝功能不全者、孕妇、哺乳期妇女慎用。因其容易进入脑内，故可引起肌肉震颤、震颤麻痹等，副作用较吗丁啉大。上述药物联合适用于烧心症状重、对西咪替丁效果较差的患者。",
                    tag: "黄金搭配方案,胃复安,奥美拉唑",
                    isdelete: 0
                }
            ]
        };
        //insert
        var result = collection.insert(query);
        if(result.result.ok) {
            arg.retJSON(JSON.stringify(result));
        }
        //var result = collection.findOne({"disease_name":params.username});
    } catch(e) {
        console.log(e);
    }
});

/*
 * 添加疾病库， 未添加方案库
 * 成功：1， 失败： 0, 已经添加：2
 */
app.post("addDiseaseLibMethod", {
    auth: false,
    index:1,
    V: false,
    O: false,
    I:0
}, {}, function*(arg) {
    try{
        var collection = arg.client.collection("diseases");
        var params = arg.fields;
        var query = {
            disease_name: params.disease_name ||"",
            disease_knowledge: params.disease_knowledge || "",
            disease_tags: params.disease_tags || "",
            healthInstruction: params.healthyInstruction || ""
        };
        var finded = yield collection.find({"disease_name": query.disease_name}).count();
        //console.log(finded);
        if(finded > 0) {
            arg.retJSON("2");
        } else {
            var result = yield collection.insert(query);
            if(result.result.ok) {
                arg.retJSON(JSON.stringify(result));
            } else {
                arg.retJSON("0");
            }
        }
    } catch(e) {
        console.log(e);
    }
});

/*
 * 在疾病库的基础上添加方案
 * 插入成功：返还result，已经插入：2，
 */

    app.post("addCombination", {
        auth: false,
        index: 1,
        V: false,
        O: false,
        I: 0
    }, {}, function*(arg) {
        try{
            var params = arg.fields;
            console.log(params)
            var disease_id = params.disease_id;
            var combinations = arg.client.collection("combinations");
            // 数据
            var query = {
                name: params.name,
                disease_id: db.ObjectID(params.disease_id),
                content: params.content,
                post: 0,
                like: 0,
                isdelete: 0,
                tag: params.tag
            }
            finded = yield combinations.findOne({"name": params.name});
            if(finded) {
                arg.retJSON("2");
            } else {
                var result = yield combinations.insertOne(query);
                if(result.result.ok) {
                    arg.retJSON(JSON.stringify(result));
                } else {
                    arg.retJSON("0");
                }
            }
        } catch(e) {
            console.log(e);
            //保存异常到数据库
        }
    });

/*
 * 查询疾病库, 加入搜索关键字的数据库（可以是疾病名，通过点击量来判断）
 * type: string, keyword: string
 */
    app.post("searchDiseaseMethod", {
        auth: false,
        index:1,
        V:false,
        O: false,
        I:0
    }, {

    }, function*(arg) {
        try{
            var collection = arg.client.collection("diseases");
            var params = arg.fields;
            var keyword = params.keyword;
            var query = {};
        // 查询可以在tag里面查询，也可以单单查询类型和准确查询
        var _default = {
            type: "disease_name",
            keyword: "感冒"
        };

        switch(params.type) {
            case "disease_name":
                query["disease_name"] = {
                    $regex:  params.keyword
                };
            break;
            case "tags":
                query["disease_tags"] = {
                    $regex: params.keyword,
                    $options: "i"
                };
                break;
            //case "disease_name":;
            //    break;
            default: ;
        }
        console.log(query);
        var result = yield collection.find(query).toArray();
        //console.log(result);
        if(result.length > 0) {
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }
});

/*
 * 查询方案库
 */
app.post("wxGetCombination", {
    auth: false,
    index:1,
    V:false,
    O: false,
    I:0
}, {}, function*(arg) {
    try {
        var params =  arg.fields;
        var combination_id = params.combination_id;
        var combination = arg.client.collection("combinations");
        console.log(params)
        var result = yield combination.findOne({"_id": db.ObjectID(params.combination_id)});
        console.log(result);
        if(result) {
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * 添加收藏
 * 1: 加入收藏成功 2： 重复加入收藏 3: 未登录
 */
app.post("collectMethod", {
    auth: false,
    index:1,
    V: false,
    O: false,
    I: 0
}, {}, function *(arg) {
        try {
            var user = arg.reply;
            var params = arg.fields;
            var islogin = (user.phone == "" || user.phone == null || user.phone == undefined);

            if(!islogin) {
                // 未登录
                var store = arg.client.collection("store");
                var json1 = {
                    user_id: db.ObjectID(user.user_id),
                    disease_id: db.ObjectID(params.disease_id)
                }
                var json = {
                    user_id: db.ObjectID(user.user_id),
                    disease_name: params.disease_name,
                    disease_id: db.ObjectID(params.disease_id),
                    time: new Date().getTime()
                }
                console.log(json);
                var finded = yield store.findOne(json1);
                if(finded) {
                    //添加之后取消收藏
                    var removeret = yield store.removeOne({"user_id": db.ObjectID(user.user_id), "disease_id" :db.ObjectID(params.disease_id)});
                    arg.retJSON("2");
                } else {
                    var result = yield store.insert(json);
                    if(result.result.ok) {
                        arg.retJSON("1");
                    }
                }
            } else {
                arg.retJSON("3");
            }
    } catch(e) {
        console.log(e);
    }
});


/*
 * 查询收藏
 * 3: 没有收藏
 */

app.post("getCollectionsMethod", {
    auth: false,
    index:1,
    O: false,
    V: false,
    I: 0
    }, {}, function *(arg) {
        try {
            var params = arg.fields;
            var user = arg.reply;
            var store = arg.client.collection("store");
            var result = yield store.find({"user_id": db.ObjectID(user.user_id)}).toArray();
            var islogin = (user.phone == "" || user.phone == null || user.phone == undefined);
            if(!islogin) {
                if(result.length > 0) {
                    arg.retJSON(JSON.stringify(result));
                } else {
                    arg.retJSON("0");
                }
            } else {
                arg.retJSON("3");
            }
        } catch(e) {
            console.log(e);
        }
});

/*
 * get cookie
 */
app.post("getCookieMethod", {
    auth: false,
    V:false,
    O: false,
    I: 0
}, {}, function*(arg) {
    try{
        var params = arg.fields;

        if(params.type) {
            var result;
            var user = arg.reply;
            console.log(user);
            switch (parseInt(params.type)) {
                case 1:
                    // username
                    result = { username:arg.reply.username };
                    break;
                case 2:
                    // id
                    result = {id:arg.reply.user_id};
                    break;
                case 3:
                    // all 登录后获取用户名
                    result = arg.reply;
                    break;
                case 4:
                    result = arg.reply;
                    break;
                case 5:
                    if(arg.reply.user_id) {
                        console.log(result);
                    };
                    break;
                default:;
            }
            arg.retJSON(JSON.stringify(result));
        }
    }catch(e){
        console.log(e);
    }
});

/*
 * 用户的搜索关键词记录, analyse表
 */
app.post("recordHotKeyMethod",{
    auth: false,
    index:1,
    V:false,
    O:false,
    I:0
}, {}, function*(arg) {
    try {
        var params = arg.fields;
        var collection = arg.client.collection("analyse");
        var date = new Date();
        var day = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        var finded  = yield collection.findOne({"day": day});
        if(finded) {
            var result = yield collection.update({"day": day}, {$push: {"keywords": params.keyword}});
        } else {
            var result = yield collection.insert({"day": day, "keyword": params.keyword});
        }
        if(result) {
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch (e) {
        console.log(e)
    }

});

/*
 * 同时查询analyse表和collection表里面的keywords
 * 3：未登录
 */
app.post("getHotKeyMethod", {
    auth: false,
    index:1,
    V: false,
    O: false,
    I:0
}, {}, function*(arg) {
    try {
        var params = arg.fields;
        var user = arg.reply;
        var result = {};
        var islogin = (user.phone==undefined);
        var analyse = arg.client.collection("analyse");

        var date = new Date();
        var day = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        var retAnalyse = yield analyse.findOne({day:day});

        if(retAnalyse) {
            result["retAnalyse"] = retAnalyse;
        } else {
            arg.retJSON("0");
            return;
        }
        if(!islogin) {
            var collections = arg.client.collection("collections");
            var retCollection = yield collections.findOne({"user_id": db.ObjectID(user.user_id)});
            if(retCollection) {
                result["retCollection"]= retCollection;
            } else {
                arg.retJSON("0");
                return;
            }
        } else {

        }
        arg.retJSON(JSON.stringify(result));
    } catch (e) {
        console.log(e)
    }

})

/*
 * 疾病被点击的时候，包括记录哪个用户点击了哪个疾病
 * 如果有keywrods的话就增加searchkeywrods
 * 如果有clickcount的话就增加clickcount
 * 如果没有登录的，不在这里面记录，在analyse表记录
 */
app.post("recordMethod", {
    auth: false,
    index:1,
    V:false,
    O:false,
    I:0
}, {}, function *(arg) {
    try {
        var collection = arg.client.collection("collections");
        var params = arg.fields;
        var user = arg.reply;
        var islogin = (JSON.stringify(user) == "{}");
        if(!islogin) {
            // 搜索事件, 登录的时候加入collection， 如果没有登录的时候，加入analyse
            if(params.keyword!= undefined) {
                var result = null;
                // 修改成upsert eg. db.users.update({age :25}, {$inc :{"age" :3}}, true)

                var finded0 = yield collection.findOne({"user_id": db.ObjectID(user.user_id)});
                if(finded0) {
                    result = yield collection.update({"user_id":  db.ObjectID(user.user_id)}, {$push: {"keywords": params.keyword}})
                } else {
                    result = yield collection.insert({"user_id": db.ObjectID(user.user_id), "keywords": [].push(params.keyword)})
                }
                arg.retJSON(JSON.stringify(result));
            }

            //点击事件
            if(params.clickcount!=undefined) {
                var disease_id = params.disease_id;
                var finded = yield collection.findOne({"user_id": db.ObjectID(user.user_id)});
                var result = null;
                // 需要考虑有无user_id, 有无创建diseaseClick
                if(finded) {
                    var finded1 = yield collection.findOne({ "user_id": db.ObjectID(user.user_id), "diseaseClick.disease_id":db.ObjectID(disease_id)});
                    if(finded1) {
                        // 添加次数
                        result = yield collection.update({"user_id": db.ObjectID(user.user_id), "diseaseClick.disease_id": db.ObjectID(disease_id)}, {$inc: {"diseaseClick.$.count": 1}})
                    } else {
                        var queryx =  {
                            $push: {
                                "diseaseClick": {
                                    "disease_id":db.ObjectID(user.user_id),
                                    "count":1
                                }
                            }
                        };
                        result = yield collection.update({"user_id": db.ObjectID(user.user_id)},queryx);
                    }
                } else {
                    var query = {
                        "user_id": db.ObjectID(user.user_id),
                        "diseaseClick": [
                            {
                            "disease_id": db.ObjectID(disease_id),
                            "count": 1
                            }
                        ]
                    };
                    result = yield collection.insert(query);
                }
                arg.retJSON(JSON.stringify(result));
            } else {
            }
        }
    } catch (e) {
        console.log(e);
    }

})

/*
 * feedback method
 * 插入全部成功的时候1, 某个表插入失败： 0 未登录： 3
 */

app.post("feedbackMethod", {
    auth: false,
    index:1,
    V: false,
    O: false,
    I:0
}, {}, function*(arg) {
    try {
        var user = arg.reply;
        var params = arg.fields;
        console.log(user)
        var feedback = arg.client.collection("feedback");
        var combinations = arg.client.collection("combinations");
        var collections = arg.client.collection("collections");

        var islogin = (user.phone == "" || user.phone == null || user.phone == undefined);
        if(!islogin) {
            var json = {
                user_id: db.ObjectID(user.user_id),
                combination_id: db.ObjectID(params.combination_id),
                post_time: new Date().getTime(),
                post_name: user.username,
                message: params.fbmessage,
                //add
                disease_name: params.disease_name,
                avatar: user.avatar,
                combination_name: params.combination_name,
                isdelete: 0
            };
            var result = yield feedback.insert(json);
            if(result.result.ok) {
                var post1 = yield combinations.update({"_id": db.ObjectID(params.combination_id)}, {$inc: {"post":1}});
                if(post1.result.ok) {
                    arg.retJSON("1")
                } else {
                    arg.retJSON("0")
                }
            } else {
                arg.retJSON("0")
            }
            //var result = yield combinations.update({"_id": db.ObjectID(params.combination_id)}, {$push: {"feedback": json}});
            //if(result.result.ok) {
            //    var query1 = {
            //        $push: {
            //            "dianpin": json.post_time
            //        }
            //    };
            //    var result1 =  collections.update({"user_id":db.ObjectID(user.user_id)}, query1);
            //    arg.retJSON(JSON.stringify(result));
            //} else {
            //    arg.retJSON("0");
            //}
        } else {
            arg.retJSON("3");
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * feedback
 * isdelete: 0未被删除， 1： 被删除
 */
app.post("getfbMethod", {
    auth: false,
    index: 1,
    V:false,
    O:false,
    I: 0
}, {},  function*(arg) {
    try {
        var feedback = arg.client.collection("feedback");
        var params = arg.fields;
        var user = arg.reply;
        var query = {
            "combination_id":db.ObjectID(params.combination_id),
            //"user_id": db.ObjectID(user.user_id)
        }
        console.log("user ------");
        console.log(user)
        var finded = yield feedback.find(query).toArray();
        if(finded.length>0) {
            arg.retJSON(JSON.stringify(finded));
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }

})

/*
 * 获取所有的商品
 * 成功，返回所有商品，失败，返回0
 * getone: 获得一条，combination，
 * getall: 获得全部
 */
app.post("getAllMethod", {
    auth: false,
    index:1,
    V:false,
    O:false,
    I: 0
}, {}, function *(arg) {

    try {
        var collection = arg.client.collection("diseases");
        var combinations = arg.client.collection("combinations");
        var store = arg.client.collection("store");
        var user = arg.reply;
        var islogin = (JSON.stringify(user) == "{}");
        var params = arg.fields;
        if(params.getall) {
            var result = yield collection.find({},{"disease_knowledge":false,"healthInstruction":false,"combinations":false,"feedback":false}).toArray();
            arg.retJSON(JSON.stringify(result));
        } else if(params.getone) {
            var result = {};
            if(!islogin) {
                var xx = yield store.findOne({"user_id":db.ObjectID(user.user_id),"disease_id": db.ObjectID(params.disease_id)});
                if(xx) {
                    result.iscollected = true;
                } else {
                    result.iscollected = false;
                }
            }
            result["all"] = yield collection.find({"_id": db.ObjectID(params.disease_id)}, {"combinations":false}).toArray();
            result["combinations"] = yield combinations.find({"disease_id": db.ObjectID(params.disease_id)}).toArray();
            arg.retJSON(JSON.stringify(result));
        }
    } catch(e) {
        console.log(e)
    }
})

/*
 * 获得点评
 */

app.post("getCommentMethod", {
    auth:false,
    index:1,
    V:false,
    O:false,
    I: 0
}, {}, function *(arg) {
    try {
        var feedback = arg.client.collection("feedback");
        var user = arg.reply;
        var islogin = (user.phone == "" || user.phone == null || user.phone == undefined);
        if(!islogin) {
                var query = {"user_id": db.ObjectID(user.user_id)};
                var result = yield feedback.find(query).toArray();
                if(result.length > 0) {
                arg.retJSON(JSON.stringify(result));
            } else {
                arg.retJSON("0");
            }
        } else {
            arg.retJSON("3")
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * dianzan
 */
app.post("dianzanMethod", {
    auth: false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        var user = arg.reply;
        var combinations = arg.client.collection("combinations");
        var params = arg.fields;
        console.log(params)
        // 未登录
        console.log(user)
        var islogin = (user.phone == "" || user.phone == undefined || user.phone == null);
        console.log("bindphone");
        console.log(islogin)
        if(!islogin) {
            var result = yield combinations.update({"_id":db.ObjectID(params.combination_id)}, {$inc:{"like":1}});
            if(result) {
                //console.log(result);
                arg.retJSON(JSON.stringify(result));
            } else {
                // 查询不到
                arg.retJSON("0")
            }
        } else {
            //未登录
            arg.retJSON("3")
        }
    } catch(e) {
        console.log(e);
    }
})

/*
 * 传入参数：
 * 阿里大鱼
 * 0：未使用， 1使用
 * type: 1：注册，2：找回密码
 * return 1: 成功 0: 失败
 */
app.post("sendMsgMethod", {
    auth:false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        var AliDayu = require('co-alidayu');
        var alidayu = new AliDayu( "23820587", "a64a661d5a9a903758c35475bfa7f976");
        var dxing = arg.client.collection("dxing");
        var c=r6();
        function r6(){
            return Math.random()*900000|0+100000;
        }
        var url_name = "联合用药";
        var sms = {
            extend: "",
            sms_free_sign_name: "联合用药",
            sms_param: {
                code: c+"",
                product: url_name
            },
            //短信接收的手机号码
            rec_num: arg.fields.phonenum,
            //短信模板
            sms_template_code: "SMS_63800932"
        };
        var _token = getToken(arg);
        console.log(arg.fields);
        console.log(sms)

        var ret = yield alidayu.send_sms(sms);
        console.log(ret);
        if(ret.alibaba_aliqin_fc_sms_num_send_response.result) {
            if(ret.alibaba_aliqin_fc_sms_num_send_response.result.success)
            {
                var finded = yield dxing.findOne({token: _token});
                if(finded) {
                    yield dxing.updateOne({token: _token}, {$set: {code: c,phone:arg.fields.phonenum,lasttime:(new Date()).getTime(),isUser:0,type:1},"$inc":{usenum:1}}, {upsert: true});
                } else {
                    //yield dxing.insertOne({ip:IP(arg.req),req:arg.req.headers["user-agent"],code:c,lasttime:(new Date()).getTime(),phone:arg.fields.phonenum});
                    yield dxing.insertOne({token:_token,ip:IP(arg.req),req:arg.req.headers["user-agent"],code:c,lasttime:(new Date()).getTime(),phone:arg.fields.phonenum});
                }
                arg.retJSON('1');//发送成功
            }else{
                arg.retJSON('2');//发送失败
            }
        } else {

        }
    } catch(e) {
        console.log(e)
    }
})

/*
 * 微信登录，提交手机验证
 * 用户已经注册
 * 0：插入错误
 * 2：验证码错误
 * 3: 用户已经注册
 *
 *
 */
app.post("phoneVerifyMethod", {
    auth:false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        var params = arg.fields;
        var dxing = arg.client.collection("dxing");
        var user = arg.client.collection("user");
        var cookie = arg.reply;
        // 阿里大鱼的短信
        var hasVP = (cookie.phone == "" || cookie.phone == null || cookie.phone == undefined);
        // 已经验证4
        console.log("has verify phone");
        console.log(hasVP);
        if(!hasVP) {
            arg.retJSON("3");
            return;
        }
        console.log(params);
        var result = yield dxing.findOne({"phone": params.phone,"code": parseInt(params.code)});
        if(result) {
            //验证成功之后，加入到user表
            var hasUser = yield user.findOne({"_id": db.ObjectID(cookie.user_id)});
            //console.log(hasUser);
            if(hasUser) {
                var retInsert = yield user.update({"_id":db.ObjectID(cookie.user_id)},{$set:{"personal.phone": params.phone}});
                if(retInsert.result.ok) {
                    json = {
                        "user_id": cookie.user_id,
                        "username": cookie.username,
                        "avatar": cookie.avatar,
                        "phone": params.phone
                    }
                    setCookie(cookie.user_id, JSON.stringify(json), arg);
                    arg.retJSON("1");
                } else {
                    //插入错误已经有验证码
                    arg.retJSON("0")
                }
            } else {
            }
        } else {
            // 验证码错误
            arg.retJSON("2");
        }
    } catch(e) {
        console.log(e);
    }
})


/*
 * 微信公众号绑定
 * 流程： 通过微信公众号来登录，登录之后需要点赞这些功能需要获取手机号。
 * 手机获取之后设置cookie
 * 这里可以设置几个cookie， 第一，有无用微信公众号登录，设置openid， 第二，有无用手机登陆
 */
app.post("Method", {
    auth: false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {

    } catch(e) {
        console.log(e);
    }
})


/*
 * 微信小程序接口
 */

/*
 * 获取疾病，并且分页
 * params: page(多少页)， pageCount(一页有多少个);
 */

app.post("wxGetAllMethod", {
    auth: false,
    index:1,
    V: false,
    I: 0,
    O: false
}, {}, function *(arg) {
    try {
        var disease = arg.client.collection("diseases");
        var result = yield disease.find({}, {"combinations": 0, "disease_knowledge": 0,"disease_tags": 0,"healthInstruction": 0}).toArray();
        arg.retJSON(JSON.stringify(result));
    } catch(e) {
        console.log(e);
    }
})

app.post("wxGetDiseaseMethod", {
    auth: false,
    index:1,
    V: false,
    I: 0,
    O: false,
}, {}, function *(arg) {
    try {
        var disease = arg.client.collection("diseases");
        var params  = arg.fields;
        console.log(params);
        var pageCount = params.pageCount;
        var page = params.page;
        var result = yield disease.find({}).skip(page*pageCount).limit(pageCount).toArray();
        if(result.length > 0) {
            arg.retJSON(JSON.stringify(result));
        } else if(result.length == 0) {
            arg.retJSON("0");
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e)
    }
})

/*
 *
 * param: keyword(搜索关键字)
 */
app.post("wxSearchDiseaseMethod", {
    auth: false,
    index:1,
    V: false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        var disease = arg.client.collection("diseases");
        var params = arg.fields;
        var result = yield disease.find({"disease_tags": {$regex: params.keyword}}).toArray();
        if(result.length>0) {
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch (e) {
        console.log(e);
    }
});

app.post("testxcxMethod", {
    auth:false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        console.log(arg.fields);
        var disease = arg.client.collection("diseases");
        var result = yield disease.find().toArray();
        arg.retJSON(JSON.stringify(result));
    } catch(e) {
        console.log(e);
    }
}, 10000)

app.post("wxLoginMethod", {
    auth: false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    var APPID = "wxc2973b85804d0bac";
    var APPSECRET = "2602b83ce48b40a3f0fb9583fb7767dc";
    https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APPID+'&secret='+APPSECRET , function(res) {
            res.on('data', function(buffer){
                console.log(buffer.toString());
                arg.retJSON()
            });
        }).on('error', function(e) {
        console.error(e);
    });
})

/*
 * params：disease_id
 * return 0: 查询失败
 */
app.post("wxgetCombinationsMethod", {
    auth: false,
    index:1,
    V:false,
    I:0,
    O: false
}, {}, function*(arg) {
    try {
        var params = arg.fields;
        var combinations = arg.client.collection("combinations");
        var disease = arg.client.collection("diseases");
        var finddisease = yield disease.findOne({"_id": db.ObjectID(params.disease_id)}, {"disease_tags": 0});
        var findcombination = yield combinations.find({"disease_id": db.ObjectID(params.disease_id)}, {"like": 0, "post": 0}).toArray();
        var result = {};
        if(finddisease) {
            result = Object.assign(result,finddisease);
            result["combinations"] = findcombination;
            arg.retJSON(JSON.stringify(result));
        } else {
            arg.retJSON("0");
        }
    } catch(e) {
        console.log(e);
    }
})


/*
 * 传入参数，判断是否相等
 */

//======== COMMON ========

/*
 * get token
 */
function getToken(arg) {
    var token =arg.req.headers['cookie'];
    token = token.split(';');
    var _token = "";
    for(var i=0;i<token.length;i++){
        var a = token[i].split('=');
        if(a[0].replace(/^\s+|\s+$/g, '') == "lhyy"){
            _token = a[1];
        }
    }
    console.log(_token);
    return jwt.decode(_token, "lhyy_2017-2027");
}

/*
 * destorycookie
 */
function destoryCookie(arg) {

}

/*setcookie
 *
 */
function setCookie(key, value, arg) {
    var today = new Date();
    var time = today.getTime() + 21600*1000;
    var time2 = new Date(time);
    var timeObj = time2.toGMTString();
    redisclient.set(key,value);
    arg.res.setHeader("Set-Cookie",'lhyy_KH='+CodeCookie(encodeURIComponent(key))+'; Expires=Wed, '+timeObj);
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


//writelogs数据库写入日志

/**
 * 获取ip地址
 */
function IP(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}
