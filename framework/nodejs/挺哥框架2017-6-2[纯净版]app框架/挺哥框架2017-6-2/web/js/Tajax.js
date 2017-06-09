/*--------------
 作者:Tennt
 --------------*/
var Tajax = {
    jg: 0, //列队间隔时间,jg的大小可以协调Tajax.send的性能,,当Tajax.jg=0时，Tajax.send与Tajax.sendnow俱备一样的竞争，但前者并发性能要好于后者，一般设置Tajax.jg＝32,这个间隔时间是留给页面渲染的进程
    _PSF: false, //判断列队是否在执行中
    _objLD: [], //列队序列，保存所有请求
    _objPool: [], //ajax连接对象池，没有列队系统情况下，多个并发的竞争会让对象池一直自增，如果有列队，程序会利用空闲的ajax对象来操作
    sendnow: function () {
        if (typeof (arguments[0]) == "string") {//直接调用时发出请求，会与其它请求竞争，可能会增加一个请求对象，不一定会使用到闲置的请求对象
            arguments._ajax = { start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
            Tajax.sendReq(arguments);
        }
        else {//由列队系统发出的请求
            if(arguments[0][0]=='post'||arguments[0][0]=='get')
            {
                Tajax.sendReq(arguments[0]);
            }
            //console.log(arguments[0][0]);

            //可以在这里判断是否要用jsonp
            if(arguments[0][0]=='jsonp')
            {
                var arg = arguments[0];
                arg._ajax.sendtime = new Date;
                var _bp=document.body.parentNode;
                var scriptobj = document.createElement('script');
                //scriptobj._jsonp={ start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
                scriptobj.language = "javascript";
                scriptobj.type = "text/javascript";
                scriptobj.defer = true; //看情况再加
                scriptobj.callback=arg[3];
                scriptobj.src = arg[1]+'?rand=' + Math.random()+"&"+arg[2];//不加会有数据缓存造成一些不可预见的错误
                _bp.appendChild(scriptobj);
                var tObj=arg[1].substr(arg[1].lastIndexOf("/")+1);
             //   alert(tObj)
                //scriptobj.abort();
                if (!/*@cc_on!@*/0) { //if not IE
                    scriptobj.onload = function () {
                        //alert(_________LZT)
                        clearTimeout(arg._ajax.clear);

                       // alert(arg._ajax.Timeout);
                        //alert(_________LZT)
                        if(!arg._ajax.Timeout)
                        {
                            arg._ajax.Timeout = false;
                            arg._ajax.Text = eval(tObj);
                            //arg._ajax.Text = _________LZT;
                            arg._ajax.stop = new Date;
                            arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                            scriptobj.callback(arg._ajax);
                            _bp.removeChild(scriptobj);
                        //    alert(1);
                        }
                    }
                } else {
                    //IE6、IE7 support js.onreadystatechange
                    scriptobj.onreadystatechange = function () {
                        if (scriptobj.readyState == 'loaded' || scriptobj.readyState == 'complete') {
                            //alert(_________LZT)
                            //alert(arg._ajax.clear+"___"+arg._ajax.Timeout);
                            clearTimeout(arg._ajax.clear);

                           // alert(arg._ajax.clear+"___"+arg._ajax.Timeout);
                            //alert(_________LZT)
                            if(!arg._ajax.Timeout)
                            {
                                arg._ajax.Timeout = false;
                                arg._ajax.Text = eval(tObj);
                               // arg._ajax.Text = _________LZT;
                                arg._ajax.stop = new Date;
                                arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                                scriptobj.callback(arg._ajax);
                                _bp.removeChild(scriptobj);
                            }
                        }
                    }
                }
                //这里要开始计时
                arg._ajax.clear = setTimeout(function () { Tajax._Timeout(scriptobj.callback, scriptobj, arg,_bp) }, arg._ajax.Limit);
            }
        }
    },
    _dostop: function (obj) {//整个列队结束时执行,这里只是设置了一个列队结束标识
        Tajax._PSF = false;
        document.getElementById("loaddiv").style.display="none";
    },
    cs: function (items, process, callback, t)//列队核心
    {
        Tajax._PSF = true; //开启列队
        var todo = items;
        setTimeout(function () {
            process(todo.shift()); //取出一个请求并执行
            if (todo.length > 0)//列队里还有任务就继续执行
            {
                setTimeout(arguments.callee, t);
            }
            else {
                callback(); //处理完毕,更改标识符
            }
        }, t);
    },
    send: function ()//增加一个任务后开始处理
    {
        if(document.getElementById("loaddiv")!=undefined){
            document.getElementById("loaddiv").style.display="block";
        }else{
            var item = document.createElement("div");
            $(item).attr("style","position: fixed;left: 0;right: 0;bottom: 0;top: 0;z-index:999;text-align: center;");
            $(item).html('<img src="images/load1.gif" style="margin-top: 300px;width: 35px;height: 35px;">');
            item.id="loaddiv";
            document.body.appendChild(item);
        }
            //之所以设置_ajax,为的是给每个请求添加一些属性
            arguments._ajax = { start: new Date, issend: false, sendtime: null, stop: null, Timeout: null, OPL: null, NL: null, Limit: arguments[4], clear: null, Text: null, Parms: arguments };
            Tajax._objLD.push(arguments); //压一个任务进列队
            if (!Tajax._PSF)//如果列队不在处理中，就重新开启
            {
                Tajax.cs(Tajax._objLD, Tajax.sendnow, Tajax._dostop, Tajax.jg);
            }
    },
    _getInstance: function (tob) {//检查哪个请求对象是闲置的
        for (var i = 0; i < this._objPool.length; i++) {
            if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
                tob.NL = i;
                tob.OPL = this._objPool.length;
                return this._objPool[i];
            }
        }

        this._objPool[this._objPool.length] = this._createObj();
        tob.NL = this._objPool.length - 1;
        tob.OPL = this._objPool.length;
        return this._objPool[this._objPool.length - 1];
    },
    _createObj: function () {//返回一个连接对象
        return (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.6.0'));
    },
    _Timeout: function (callback, objXMLHttp, arg,_bp) {

        //超时分两种,一种是当地址出错,数据返不回来,延时到超时的情况.
        //另一种是经测试,当请求是通过列队发出,并且超时设置得比较低如10的时候,有可能在正确返回了
        //数据的情况下,计时器还没有取消,导致这里的回调会再一次执行,那么就要先设置arg._ajax.issend
        //然后再判断是否已经执行了回调,如果执行了,那么这里就不会再执行
        //alert(arg[0])
        if(arg[0]!="jsonp")
        {
            objXMLHttp.abort(); //如何把这一行移到callback(arg._ajax);上面,又会出现两次回调,原因是,在这里又没
        }
        //取消的话,objXMLHttp还是在请求中

        if (!arg._ajax.issend) {//判断是否已经正确取回数据，这里要加这个是有可能在超时时，仍然取回了数据
            arg._ajax.Timeout = true;
            arg._ajax.stop = new Date;
            //arg._ajax.Text=
            //arg._ajax.issend=false;
            callback(arg._ajax);
            if(arg[0]=="jsonp")
            {
                _bp.removeChild(objXMLHttp);
            }
        }
    },
    sendReq: function () {// 发送请求(方法[post,get], 地址, 数据, 回调函数)
        var arg = arguments[0];
        arg._ajax.sendtime = new Date; //这个是当前请求发出的时间
        //要查看请求所花的时间是obj.stop - obj.sendtime
        //要查看请求从发出到结束所花的真实时间是obj.stop - obj.start
        var callback = arg[3];
        var objXMLHttp = this._getInstance(arg._ajax);
        url = arg[1];

        objXMLHttp.open(arg[0], url, true);
        objXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        objXMLHttp.send(arg[2]);
        objXMLHttp.onreadystatechange = function () {
            //alert(objXMLHttp.readyState+","+objXMLHttp.status);
            //如果有设置超时,那么这里能够执行，即是在未超时情况下就执行了,但也可能刚好两者都存在,即这里执行了,又执行了超时处理
            //于是要设置arg._ajax.issend = true;然后在计时器里再判断,避免两次回调,计时器回调的是超时的回调
            if (objXMLHttp.readyState == 4 && (objXMLHttp.status == 200 || objXMLHttp.status == 304)) {
                clearTimeout(arg._ajax.clear); //要明白这里未必会执行到,当目标地址不对,这里是没办法处理的
                arg._ajax.Timeout = false;
                arg._ajax.Text = objXMLHttp.responseText;
                arg._ajax.stop = new Date;
                arg._ajax.issend = true; //通知计时器这里已经执行了,并且数据已经准备好可供读取
                callback(arg._ajax);
            }
            else
            {
               // alert(objXMLHttp.readyState+","+objXMLHttp.status);
            }
        }
        //本来还想设置说当超时时间为0时,就不开启计时器,但这样是不行的,原因是为了通过计时器来避免当目标请求地址出错(如失效之类)时,没有出错回调机制这个问题
        arg._ajax.clear = setTimeout(function () { Tajax._Timeout(callback, objXMLHttp, arg) }, arg._ajax.Limit);
    }
};
/*
 //总算可以完成了,注释下来再细化,上面还有很注释是不当的,但代码上基本没什么太大的问题
 使用方法

 Tajax.jg 的大小可以协调Tajax.send的性能,当Tajax.jg=0时，Tajax.send与Tajax.sendnow俱备一样的竞争，但前者性能要好于后者，一般设置Tajax.jg＝32,为的是不抢占页面渲染的线程
 Tajax.send("请求类型:建议全是post","请求目标地址","请求的数据","回调函数","超时时间","页面所需要传输的参数,用逗号隔开,这一部分不会发送到服务端,只会在页面本身进行处理,可任意多,不超出系统限制就行");
 Tajax.send("post", "command/cs.ashx", "a=3&b=4&c=5", Init, 100, "b", cc,i);//加入请求列队,重复使用闲置的请求对象
 Tajax.sendnow("post", "command/cs.ashx", "a=3&b=4&c=5", Init, 100, "b", cc,i);//直接发出请求，会与其它请求竞争，可能会增加一个请求对象，不一定会使用到闲置的请求对象，建议不在与多个ajax请求并发情况下使用
 function(obj)
 {
 obj.Limit //超时时间
 obj.OPL //系统当前请求连接池长度
 obj.NL //当前连接使用了连接池里哪个连接
 obj.Parms //连接的各种参数,前五个参数顺序是固定的(请求类型，请求目标，参数，回调函数，设置超时时间0为不设置超时，parms..)之后要设置的参数都可以以逗号隔开，函数也可以作为参数进行传参
 obj.start //发起连接时间
 obj.sendtime//发出请求的时间
 obj.stop //连接完成或超时的时间
 obj.Timeout //是否超时
 obj.Text //返回请求的值
 //要查看请求所花的时间是obj.stop - obj.sendtime
 //要查看请求从发出到结束所花的真实时间是obj.stop - obj.start,且因为列队系统有计时间隔的存在,每一个请求都要比前一个多花一些间隔的时间
 //总体上看来Tajax.send与Tajax.sendnow同时发出100条请求的话,前者花的总时间是多于后者的,但后者这么多请求又没留给时间让页面渲染,用户体验不是很好
 //所以Tajax.send建议应用于需要多个并发请求的环境,Tajax.sendnow则可以作为单独的请求发出,效果会比较好
 //由于有计时器的存在,时间上会不太准确,但已经很接近
 }
 */