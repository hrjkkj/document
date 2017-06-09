
/**
 * Created by tennt on 2015/7/11.
 */



var htps=true;
var cs=null;
var X=1;
var CurrentID="";


var uid=0;
var goback=[];
var _goback=[];
var _backclcik=false;
var isbacking=false;//如果页面在回退中就不能点击其它回退

var myScrollLeft,myScrollRight,myScrollTw = null;/*滑动*/

function $M(id){return document.getElementById(id)};
function X_x(strhtml){return strhtml.replace(/(\d+\.?\d*)px/g,function(){return parseFloat((arguments[1])*X).toFixed(5)+"px";});}
//function X_x(strhtml){return strhtml.replace(/(\d+\.?\d*)px/g,function(){return parseFloat((arguments[1])*X/16).toFixed(5)+"rem";});}

var tempdiv=null;
var len=0;
var oOo=[];
var _correct=0;
var zIndex=9;
var NowPageObj=null;//这是容器对象
var ism=false;
var  lasthash=null;
var q=0;
var myScroll=null;
function pop(html,id,top,left,width,height)//obj为触发事件所在的元素对象，html为html代码片断，id为代码片断所设置的对象id，top left为代码片断浮动元素所对应的上左距离
{


    var popobj = document.createElement('div');
    popobj.id= id;
    //z-index:'+zIndex+';
    popobj.style.cssText=X_x('position: absolute;top: '+top+';left: '+left+';width:'+width+';height:'+height+';overflow:hidden;');
    popobj.innerHTML=X_x(html);
    $M(CurrentID).appendChild(popobj);

}
function htd(h,P)
{
   // alert(P.ID)
    tempdiv = document.createElement('div');
    tempdiv.id= P.ID;
    tempdiv.style.cssText='position: absolute;top: 0px;left: 0px;width:'+cs._wh[0]+'px;height:'+cs._wh[1]+'px;overflow:hidden';//z-index:'+zIndex
    tempdiv.innerHTML=h;
    var doc = document.createDocumentFragment();
    doc.appendChild(tempdiv);
    return doc;
}
function Pop(T,P,B)
{
    //edit
    if(!P.W)//如果还从未加载过P这个模块
    {
        P.Fragment=htd(X_x(T+P.HTMLFragment+B),P);//注意这里的处理，只是把自适应过的代码重新赋给页面模块的HTML，并没有连同容器的CSS也赋给了
       // console.log(P.ID)
      //  console.log(P.Fragment)
       // alert(1)
    }
    //--------------完成打包并设置页面参数

    if(CurrentID!=P.ID)
    {
        //console.log(P.Fragment)
      //  $M("__Body").appendChild(P.Fragment);
        $M("__Body").appendChild(P.Fragment.cloneNode(true));
       // console.log(P.Fragment)
    }


  //  alert(CurrentID+","+P.ID)
    if(CurrentID!=""&&CurrentID!=P.ID)//当NowPageObj不等于null时，说明当前已经有打开的页面模块，在销毁模块时需要进行模块的注销处理
    {
       // alert(CurrentID+","+window[CurrentID].P)
        window[CurrentID].Logout();//销毁前注销处理，也就是执行一些销毁前要处理的事务
      //  alert($M(CurrentID).innerHTML)
        window[CurrentID].Fragment=htd($M(CurrentID).innerHTML,window[CurrentID]);
        $M("__Body").removeChild($M(CurrentID));//销毁模块
    }
    P.P=CurrentID;

    if(!P.W)
    {
        P.Init();//页面加载完成后进行初始化
        P.W=true;
    }
    else
    {
        P._Init();//这个只是用来初始化检查页面数据是否过期的函数
    }

  //  tempdiv.style.display="block";

   // CurrentID=tempdiv.id; P.ID
    CurrentID=P.ID;



    $M('iscroll_'+ P.ID).style.height=(cs._wh[1]-X*(P.H))+"px";//计算滚动区域应有的高度


    myScroll = new IScroll('#iscroll_'+ P.ID, {
        probeType: 1,
        preventDefault: true
    });//针对页体做滚动处理

    myScroll.refresh();//容器显示后，进行iscroll的重置



  //  $M("__Cover").style.zIndex=0;//遮盖层撤消
    if(typeof (P.U) == "undefined"){
        P.U = "";
    }
    window.location.hash="p:"+P.ID+P.U;
    //  window.history.pushState(P.ID)

    // console.log(window.history.state)

//http://www.cnblogs.com/flash3d/archive/2013/10/23/3384823.html
}

function CPop(P)
{


    var DQ=window[P];

    var CP=window[DQ.P];
   // console.log(CP.W)
    if(!CP.W)//如果还从未加载过P这个模块
    {
        CP.Fragment=htd(X_x(window[CP.ID+"T"]+CP.HTMLFragment+window[CP.ID+"B"]),CP);//注意这里的处理，只是把自适应过的代码重新赋给页面模块的HTML，并没有连同容器的CSS也赋给了

        //  console.log(P.Fragment)
        // alert(1)
    }
    DQ.P="";







    //-----------------------------




    $M("__Body").appendChild(CP.Fragment.cloneNode(true));
   // tempdiv.style.display="block";

    if(P!="")
    {
      //  alert(CP.ID)
        DQ.Logout();
        DQ.Fragment=htd($M(P).innerHTML,DQ);
        //console.log(CP.Fragment)
        $M("__Body").removeChild($M(P));//销毁模块
    }
    if(!CP.W)
    {
        CP.Init();//页面加载完成后进行初始化
        CP.W=true;
    }
    else
    {
        CP._Init();//这个只是用来初始化检查页面数据是否过期的函数
    }

    CurrentID=CP.ID;//tempdiv.id;


    $M('iscroll_'+ CP.ID).style.height=(cs._wh[1]-X*(CP.H))+"px";//计算滚动区域应有的高度

    myScroll = new IScroll('#iscroll_'+ CP.ID, {probeType: 1,
        preventDefault: true});//针对页体做滚动处理
    myScroll.refresh();//容器显示后，进行iscroll的重置

  //  $M("__Cover").style.zIndex=0;
    //  window.location.hash="";
}


var StartTime=0;
var MoveTime=0;
var EndTime=0;
var startX = 0;
var startY = 0;
var moveX = 0;
var moveY = 0;
//alert(1)
function ismove()
{
    $('#iscroll_'+ tempdiv.id).trigger('scroll');

    //触发事件的条件有二，一个是在理想情况下，move的对象移动坐标距离都为0，这个是直接快速点击时发生的。二是请允许在点击时有细微的偏移，主要是以偏移速度结合偏移距离为条件，超过一定数值则为滑动而不是点击
   // alert(MoveTime-StartTime)
   // alert(startX+","+startY+"\r\n"+moveX+","+moveY)
   // alert(MoveTime+"\r\n"+StartTime+"\r\n"+moveX+","+moveY)
    var jl=Math.sqrt((moveY-startY)*(moveY-startY)+(moveX-startX)*(moveX-startX));
    var sj=MoveTime-StartTime;
  /*  Tajax.send("post","c1","jl="+jl+"&sj="+sj,function(obj){
        //  alert(obj.Text)
        var Obj=JSON.parse(obj.Text);

        //console.log(Obj)
        if(Obj.error!=undefined)
        {
            // alert(Obj.error)
        }
        else
        {
            // alert(Obj.ret)

        }

    },10000);
    */
    if(moveX==0&&moveX==moveY)
    {
        //alert(moveX+","+moveY)
        return false;
    }
    else
    {
        var jl=Math.sqrt((moveY-startY)*(moveY-startY)+(moveX-startX)*(moveX-startX));
        var sj=MoveTime-StartTime;
      /*  Tajax.send("post","c6","jl="+jl+"&sj="+sj,function(obj){
            //  alert(obj.Text)
            var Obj=JSON.parse(obj.Text);

            //console.log(Obj)
            if(Obj.error!=undefined)
            {
                // alert(Obj.error)
            }
            else
            {
                // alert(Obj.ret)

            }

        },10000);
*/
        if(jl<=30&&sj<=300)//允许最大偏移30个像素距离，触发时间最大300毫秒
        {
            return false
        }
        else
        {
            //alert(sd+"\r\n"+jl)
            return true;
        }


    }
    if((MoveTime-StartTime)>0)//大于0说明有拖动
    {
        //alert(MoveTime+"\r\n"+StartTime+"\r\n"+startX+","+startY+"\r\n"+moveX+","+moveY)
        //alert(MoveTime+"\r\n"+StartTime+"\r\n"+Math.sqrt((moveY-startY)*(moveY-startY)+(moveX-startX)*(moveX-startX)));
        return true;
    }
    else//在不拖动下点击进行
    {
        //alert(MoveTime+"\r\n"+StartTime+"\r\n"+startX+","+startY+"\r\n"+moveX+","+moveY)
        return false;
    }
}

function EventStart(e)
{
    //重置这三项为0是很重要的一步
    MoveTime=0;
    moveX = 0;
    moveY = 0;

    StartTime=(new Date()).getTime();
    var touch = e.touches[0]; //获取第一个触点
    startX = Number(touch.pageX); //页面触点X坐标
    startY = Number(touch.pageY); //页面触点Y坐标
    //记录触点初始位置

    //console.log(startX+","+startY)
}

function EventMove(e)
{
    $('input').blur();
    $('textarea').blur();
    MoveTime=(new Date()).getTime();

    var touch = e.touches[0]; //获取第一个触点
    moveX = Number(touch.pageX); //页面触点X坐标
    moveY = Number(touch.pageY); //页面触点Y坐标
    //alert(moveX+","+moveY)
    //记录触点初始位置

    //console.log(moveX+","+moveY)

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

var qjaa=new Object();//qjaa需要增加一个计时器，触发机制是当qjaa._End=false;然后设定一个超时机制，点击后多少秒内没反应就取消
qjaa._End=true;
var endt=0;
function EventEnd(e)
{


    EndTime=(new Date()).getTime();
    if(!ismove()){//页面滚动中点击无效

        var pobj=FunMark(e.target);
       // console.log(pobj.getAttribute('event'))

        if(pobj.getAttribute('event')==null)
        {
            return false;
        }

        var event=pobj.getAttribute('event').split('.');

        if(event.length==1)
        {
            event=window[event[0]];
        }
        else
        {
            event=window[event[0]][event[1]];
        }

        if(event!=undefined)
        {
            if(!qjaa._End)//在这里判断当前是否有event事件在执行中，有则提示，无则继续执行，这是解决重复点击的问题
            {

                //这里会触发qjaa的计时器
                alert("当前已点击的业务正在处理中，请稍后操作");
                qjaa._End=true;
                return;
            }
            pobj.RunEnd=function()//这里很可能会有内存泄漏
            {
                qjaa._End=true;
                //这里把当前所点击的事件所在的元素对象给保存起来，放在一个全局变量里，为的是让其它事件点击判断当前是否还有事件在执行中，一旦pobj.RunEnd设置为true，其它事件就可以继续执行
            }
            qjaa._End=false;//放在这里才是对的，要不所有元素都要弄上.RunEnd=false

            if(event.parms!=undefined)
            {
                pobj.parms=event.parms;
            }
            else
            {
                if(pobj.getAttribute('parms')===null)
                {
                    pobj.parms={};
                }
                else
                {
                    pobj.parms=JSON.parse(pobj.getAttribute('parms').replace(/'/ig,'"'));
                }
            }
            event(pobj)

        }
        // alert(window[event])
        /*
        if(event!=undefined&&window[event]!=undefined)
        {
            if(!qjaa._End)//在这里判断当前是否有event事件在执行中，有则提示，无则继续执行，这是解决重复点击的问题
            {

                //这里会触发qjaa的计时器
                alert("当前已点击的业务正在处理中，请稍后操作");
                return;
            }
            pobj.RunEnd=function()//这里很可能会有内存泄漏
            {
                qjaa._End=true;
                //这里把当前所点击的事件所在的元素对象给保存起来，放在一个全局变量里，为的是让其它事件点击判断当前是否还有事件在执行中，一旦pobj.RunEnd设置为true，其它事件就可以继续执行
            }
            qjaa._End=false;//放在这里才是对的，要不所有元素都要弄上.RunEnd=false

            if(window[event].parms!=undefined)
            {
                pobj.parms=window[event].parms;
            }
            else
            {
                if(pobj.getAttribute('parms')===null)
                {
                    pobj.parms={};
                }
                else
                {
                    pobj.parms=JSON.parse(pobj.getAttribute('parms').replace(/'/ig,'"'));
                }
            }
            window[event](pobj)

        }
        */

    }
}

function FunMark(obj)//向上查找拥有event标识的元素对象
{
    while(obj.getAttribute('event')==null&&obj.nodeName!='BODY')
    {
        obj = obj.parentNode;
    }
    return obj;
}

function Open(F,obj)
{
    if(obj!=undefined)
    {
        window[F].RunEnd=obj.RunEnd;
    }
    Pop(window[F+"T"],window[F],window[F+"B"]);
}




function togoback(_obj)
{
    //console.log(window.history)

   if(CurrentID==""||window[CurrentID].P=="")
    {
        Open("xxt_index");
        return;
    }
  //  console.log(112334)
    CPop(CurrentID);
    //if(_obj!=1)
    //{
    //    window.history.go(-1)
    //}
    //_obj.RunEnd();
}
/*图片出错*/
function zwtp(obj){
    obj.src="images/err.jpg";
    obj.onerror=null;
}

//==============================================点击事件============================================================
