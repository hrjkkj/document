_Tajax = "https://b.jtryy.com/";
_url = "https://trb2b.ikanghu.cn/";
xxt_commodity_details.collect = function(obj)
{

    Tajax.send("post",_Tajax+"go_collection","spid="+xxt_commodity_details.spid,function(object){
        //alert(spid);
        if(object.Text == "login"){
            $.MsgBox.Confirm("您未登录，是否前往登录？", function(){
                Open("xxt_login");
            },function(){

            });
        }else{
            if(object.Text == "0"){
                t_s("取消收藏成功");
            }else if(object.Text == "1"){
                t_s("收藏成功");
            }
            if(obj.className == "collect_nochk") {
                var coll = document.getElementById("foot_collect");
                obj.className = "collect_chk";
                coll.innerHTML = "已收藏";
            } else {
                var coll = document.getElementById("foot_collect");
                obj.className = "collect_nochk"
                coll.innerHTML = "收藏";
            }
        }

    },10000);
    obj.RunEnd();
}
xxt_commodity_details1.collect = function(obj)
{

    Tajax.send("post",_Tajax+"go_collection","spid="+xxt_commodity_details.spid,function(object){
        //alert(spid);
        if(object.Text == "login"){
            $.MsgBox.Confirm("您未登录，是否前往登录？", function(){
                Open("xxt_login");
            },function(){

            });
        }else{
            if(object.Text == "0"){
                t_s("取消收藏成功");
            }else if(object.Text == "1"){
                t_s("收藏成功");
            }
            if(obj.className == "collect_nochk") {
                var coll = document.getElementById("foot_collect");
                obj.className = "collect_chk";
                coll.innerHTML = "已收藏";
            } else {
                var coll = document.getElementById("foot_collect");
                obj.className = "collect_nochk"
                coll.innerHTML = "收藏";
            }
        }

    },10000);
    obj.RunEnd();
}
xxt_commodity_details1.checkOut = function(obj)
{
    /*判断三证是否过期 xt_submit_order.html*/
    Tajax.send("post", _Tajax+"pdsz_cx", "", function (object) {
        if(object.Text == "login"){
            $.MsgBox.Confirm("您未登录，是否前往登录？", function(){
                Open("xxt_login");
            },function(){

            });
        }else if(object.Text == "0"){
            t_s("提交订单有误!")
        }else if(object.Text == "1"){
            t_s("当前账号审核未通过!")
        }else if(object.Text == "2"){
            t_s("三证信息有误!")
        }else if(object.Text == "z1"){
            t_s("营业执照已过期，请到pc端重新修改,再发起审核!")
        }else if(object.Text == "z2"){
            t_s("GSP认证已过期，请到pc端重新修改,再发起审核!")
        }else if(object.Text == "z3"){
            t_s("药品经营许可已过期，请到pc端重新修改,再发起审核")
        }else if(object.Text == "4"){
            t_s("商品已失效无法购买")
        }else{
            xxt_submit1.spid = xxt_commodity_details1.spid;
            xxt_submit1.t=xxt_commodity_details1.t;
            xxt_submit1.xid=obj.parms.xid;
            xxt_submit1.n=document.getElementById("commodity_details_input").value;
            Open("xxt_submit1");
            xxt_submit1.P="xxt_index";
        }
    }, 10000);
    obj.RunEnd();
}

xxt_index._Init = function () {
    xxt_index.allindex();
}
xxt_commodity_details1.adddetails = function () {
    var spid = xxt_commodity_details1.spid;
    if(spid){
        Tajax.send("post",_Tajax+"selectCommodity_cx","id="+spid+"&t="+xxt_commodity_details1.t,function (object) {

            var json = JSON.parse(object.Text);
            document.getElementById("spmc").innerText = json.commodity.spmc;
            document.getElementById("spcj").innerText = json.commodity.spcj;
            if(json.id && json.id!="" && json.id!=null){
                document.getElementById("spxsj").innerText = "￥"+json.sale.panic;
                document.getElementById("spscj").innerText = "￥"+json.commodity.spxsj;
                if(json.coll=="0" || json.coll==""){
                    document.getElementById("details_foot1").className = "collect_nochk";
                    document.getElementById("foot_collect").innerText = "收藏";
                }else{
                    document.getElementById("details_foot1").className = "collect_chk";
                    document.getElementById("foot_collect").innerText = "已收藏";
                }
            }else{
                document.getElementById("spxsj").innerHTML = "<span class='nologin'>登录显示价格</span>";
            }
            if(parseInt(json.sale.stock)>0){
                document.getElementById("kcdiv").innerHTML = '<div class="stock_details">库存 '+json.sale.stock+' 件</div>'
            }else{
                document.getElementById("kcdiv").innerHTML ='<div class="out_stock">缺货</div>'
            }
            document.getElementById("commodity_details_input").value = 1;
            document.getElementById("commodity_details_input").title = 1;
            document.getElementById("smname").innerText = json.commodity.spmc;
            document.getElementById("smcj").innerText = json.commodity.spcj;
            document.getElementById("smcf").innerText = json.commodity.spcf;
            document.getElementById("smpzwh").innerText = json.commodity.sppzwh;
            document.getElementById("smxz").innerText = json.commodity.spxz;
            document.getElementById("smgg").innerText = json.commodity.spgg;
            document.getElementById("smspzzgn").innerText = json.commodity.spzzgn;
            if(xxt_commodity_details1.t == "buying"){
                var html = '';
                html+='<div class="xt_bottom_border"><div class="details_promotion_info"><span class="promotion_info_ico">'+json.fltext+'</span><div class="xt_ico_gray right promotion_info_text ">限量抢购'+json.sale.stock_name+''+json.commodity.spdw+'</div></div></div>';
                document.getElementById("cxdiv").innerHTML = html;
            }else if(xxt_commodity_details1.t == "time"){
                var html = '';
                var t1 = new Date(parseInt(json.sale.startTime));
                var t2 = new Date(parseInt(json.sale.endTime));
                html+='<div class="xt_bottom_border"><div class="details_promotion_info"><span class="promotion_info_ico">'+json.fltext+'</span><div class="xt_ico_gray right promotion_info_text ">'+t1.getFullYear()+'年'+ (t1.getMonth()+1)+'月'+t1.getDate()+'号-'+t2.getFullYear()+'年'+(t2.getMonth()+1)+'月'+t2.getDate()+'号</div></div></div>';
                document.getElementById("cxdiv").innerHTML = html;
            }


            var islb = false;
            var html='<li><div class="pic"><img src="'+_url+'upload/middle/'+json.commodity.sptm+'.jpg" class="banner_img" onerror="zwtp(this)" /></div></li>';
            for(var i=i;i<7;i++){
                if(xxt_commodity_details1.CheckImgExists(_url+"upload/middle/"+json.commodity.sptm+"_"+i+".jpg")){
                    html+='<li><div class="pic"><img src="'+_url+'upload/middle/'+json.commodity.sptm+'_'+i+'.jpg" class="banner_img" onerror="zwtp(this)" /></div></li>';
                    islb = true;
                }else{
                    break;
                }
            }
            document.getElementById("lbdiv").innerHTML = html;
            TouchSlide({
                slideCell: "#commodity_details_banner",
                titCell: ".hd ul",
                mainCell: ".bd ul",
                effect: "leftLoop",
                interTime: "3000",
                autoPage: true,

                autoPlay: islb
            });
            if(json.tj.length>0){
                var html = '';
                for(var i = 0; i < json.tj.length; i++) {
                    html += '<div event="xxt_list.comm" parms="{\'id\':\''+json.tj[i]._id+'\'}" class="recommended_div white_color"> <div class="recommended_img left"> <img class="recommended_img_ico" src="'+_url+'upload/middle/'+json.tj[i].sptm+'.jpg" onerror="zwtp(this)" /> </div> ' +
                        '<div class="recommended_text left"> <div class="recommended_sct">' + json.tj[i].spmc + '</div> <div class="xt_ico_red">'+(json.id=="" || json.id==null?"<span class='nologin'>登录显示价格</span>":"￥" + hs(json.tj[i].spxsj)) + '</div> </div> </div>';
                }
                document.getElementById("details_recommended_list").innerHTML = html;
            }

            if(parseInt(json.sale.stock)>0){
                document.getElementById("gwcdiv").innerHTML='<div class="addCart_btn ">加入购物车</div><div class="details_foot_checkout" event="xxt_commodity_details1.checkOut" parms="{\'xid\':\''+json.xsxlid+'\'}">立即购买</div>';
            }else{
                document.getElementById("gwcdiv").innerHTML='<div class="addCart_btn ">加入购物车</div><div class="addCart_btn" >立即购买</div>';
            }
            myScroll.refresh();
        },10000)
    }else{
        t_s("获取不到商品详情");
    }
}
xxt_commodity_details1.onblue = function(obj) {
    EventNum(obj,obj.title);
    obj.RunEnd();
}
xxt_commodity_details1.guc1=function (obj) {
    var id = obj.parms.spid;
    var r=/^[0-9]+.?[0-9]*$/;//判断是否为字母
    var reg=/^\d+[.]?\d{1}$/;//判断小数点后的数字
    var arg = /.*\..*/;

    // alert(xl);
    var num = document.getElementById("commodity_details_input").value;
    if(num== ""){
        $.MsgBox.Confirm("输入框为空，请输入有效数字！");
        return false;
    }
    if(num<= "0" || !r.test(num)){
        $.MsgBox.Confirm("请输入大于0的有效正整数");
        return false;
    }
    if(arg.test(num)){
        if(!reg.test(num)){
            $.MsgBox.Confirm("抱歉，只能保留一个小数点");
            return false;
        }

    }
    Tajax.send("post",_Tajax+"zb_000035x","spid="+encodeURIComponent(id),function (object){
        if(object.Text == "0"){
            addgwc(id,num);
        }else{
            t_s("商品正在促销,请到立即购买");
        }
    },10000)
    obj.RunEnd();
}
xxt_commodity_details.guc1=function (obj) {
    var id = obj.parms.spid;
    var r=/^[0-9]+.?[0-9]*$/;//判断是否为字母
    var reg=/^\d+[.]?\d{1}$/;//判断小数点后的数字
    var arg = /.*\..*/;

    // alert(xl);
    var num = document.getElementById("commodity_details_input").value;
    if(num== ""){
        $.MsgBox.Confirm("输入框为空，请输入有效数字！");
        return false;
    }
    if(num<= "0" || !r.test(num)){
        $.MsgBox.Confirm("请输入大于0的有效正整数");
        return false;
    }
    if(arg.test(num)){
        if(!reg.test(num)){
            $.MsgBox.Confirm("抱歉，只能保留一个小数点");
            return false;
        }

    }
    Tajax.send("post",_Tajax+"zb_000035x","spid="+encodeURIComponent(id),function (object){
        if(object.Text == "0"){
            addgwc(id,num);
        }else{
            t_s("商品正在促销,请到立即购买");
        }
    },10000)
    obj.RunEnd();
}
function EventNum(obj,val)
{
    $("input").blur(function (){
        var r=/^[0-9]+.?[0-9]*$/;//判断是否为字母
        var reg=/^\d+[.]?\d{1}$/;//判断小数点后的数字
        var arg = /.*\..*/;

        if(obj.value== ""){
            $.MsgBox.Confirm("输入框为空，请输入有效数字！");
            obj.value = val;
        }
        if(obj.value<= "0" || !r.test(obj.value)){
            $.MsgBox.Confirm("请输入大于0的有效正整数");
            obj.value = val;
        }
        if(arg.test(obj.value)){
            if(!reg.test(obj.value)){
                $.MsgBox.Confirm("抱歉，只能保留一个小数点");
                obj.value = val;
            }
        }
        if(parseFloat(obj.value)%parseFloat(val) != 0){
            $.MsgBox.Confirm("抱歉，输入数量必须是中包装"+val+"倍数");
            obj.value = val;
        }
    });
    obj.RunEnd();
}
xxt_ranking.showrankHTML = function (json,userid) {
    if(!userid){
        userid = "";
    }
    var html="";
    document.getElementById("ranking_shop_list").innerHTML = html;
    for(var i=0;i<json.length;i++){
        html += '<div class="ranking_div xt_bottom_border white_color"><div event="xxt_list.comm" parms="{\'id\':\''+json[i]._id+'\'}"> <div class="ranking_commodity left"> <img class="ranking_commodity_ico lazy" src="images/err.jpg" onerror="zwtp(this)" data-original="'+_url+'upload/middle/'+json[i].sptm+'.jpg" event="xxt_list.comm" parms="{\'id\':\''+json[i]._id+'\'}" /> </div> ' +
            '<div class="ranking_commodity_details right"> <div class="hot"><img class="hot_img_ico" src="images/hot.png"/>已销 <span>'+(json[i].xl?json[i].xl:0)+'</span> 件 </div> <div class="ranking_text pd_left_eight">'+cfy(json[i].iscfy)+' '+json[i].spmc+'</div> ' +
            '<div class="ranking_money xt_ico_width"> <div class="xt_ico_red xt_ico_width">'+((userid=="null" || userid=="")?"<span class='nologin nologin_mg_top'>登录显示价格</span>":"￥"+hs(json[i].spxsj))+'</div> <del class="search_ico_gray pd_left_eight">'+"￥"+((userid=="null" || userid=="" || json[i].spscj=="0")?"":json[i].spscj)+'</del> </div> ' +
            ' </div></div><div event="xxt_ranking.Popup" class="ranking_shopCart" id="ranking_shopCart' + i + '"><img src="images/search_shopCart.png" event="guc" parms="{\'spid\':\''+json[i]._id+'\',\'xl\':\''+(json[1].zhongbz?json[1].zhongbz:1)+'\'}"/> </div> </div>';
    }
    document.getElementById("ranking_shop_list").innerHTML = html;
    TouchSlide({
        slideCell: "#ranking_main"
    });
    myScroll.refresh();//容器显示后，进行iscroll的重置
    $("img.lazy").lazyload();
}
xxt_new_commodity.addnew = function () {
    Tajax.send("post",_Tajax+"addnew","",function (object) {

        var json = JSON.parse(object.Text);
        if (json[0].length > 0) {
            var html = "";
            for (var i = 0; i < json[0].length; i++) {
                var __img = (json[0][i].imgurl).split('/');
                html += '<li><div class="pic"><img id="img1" src="' + _url + 'upload/middle/' + __img[__img.length - 1] + '" class="newCommodity_banner_img" /></div></li>';
            }
            document.getElementById("lbtp").innerHTML = html;
            TouchSlide({
                slideCell: "#slideBox",
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true
            });
        }
        if (json[1].length > 0) {
            var html = '';
            for (var i = 0; i < json[1].length; i++) {
                html += '<div class="commodity_div xt_bottom_border white_color"><div> <div class="commodity_img left"> <img class="commodity_img_ico" onerror="zwtp(this)" src="' + _url + 'upload/middle/' + json[1][i].sptm + '.jpg" event="xxt_list.comm" parms="{\'id\':\'' + json[1][i]._id + '\'}" /> </div> ' +
                    '<div class="commodity_text right"> <div class="commodity_sct">' + cfy(json[1][i].iscfy) + ' ' + json[1][i].spmc + '</div> ' +
                    '<div class="commodity_money xt_ico_width"> <div class="xt_ico_red xt_ico_width">' + (json[2] == null || json[2] == "" ? "<span class='nologin'>登录显示价格</span>" : "￥" + hs(json[1][i].spxsj)) + '</div> <del class="search_ico_gray">'+ (json[2] == null || json[2] == "" || json[1][i].spscj == "0" ? "&nbsp;" : "￥" +json[1][i].spscj) + '</del> </div> ' +
                    '</div> </div> <div class="commodity_shopCart" id="commodity_shopCart' + i + '"><img src="images/search_shopCart.png" event="guc" parms="{\'spid\':\'' + json[1][i]._id + '\',\'xl\':\''+(json[1][i].zhongbz?json[1][i].zhongbz:1)+'\'}"/> </div></div>';
            }
            document.getElementById("commodity_list").innerHTML = html;
        }
        myScroll.refresh();//容器显示后，进行iscroll的重置
        $("img.lazy").lazyload();

    },10000)
}