/**
 * Created by jy on 2016/1/22.
 */
var data1=['12','13','14','15','16','17','18','19','20','21','22','23','00','01','02','03','04','05','06','07','08','09','10','11'];
var data2=['30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'];

function $(id){return document.getElementById(id)};
function X_x(strhtml){return strhtml.replace(/(\d+\.?\d*)px/g,function(){return parseFloat((arguments[1])*X).toFixed(5)+"px";});}
var __Body=null;
var cs=null;
var X=null;
var hkj=null;
var mkj=null;

function show()
{
    alert(hkj.selectvalue+":"+mkj.selectvalue);
}

function scrollTennt(id,data,class1,class2,_w,_h,_p)
{
    this.selectvalue="00";
    var my=this;

    var bc=parseInt(_p/2);

    var len=data.length;
    var hlen=parseInt(data.length/2)+(data.length%2);
    var newobj=$(id);
    newobj.style.cssText="float:left;width:"+_w+"px;height:"+(_p*_h)+"px;overflow: hidden;"+class1;

    var cnewobj = document.createElement('div');
    cnewobj.style.cssText="width:"+_w+"px;height:"+(len*_h)+"px;text-align: center;";

    for(var i=0;i<len;i++)
    {
        var ct = document.createElement('div');
        ct.style.cssText="width:"+_w+"px;height:"+_h+"px;line-height:"+_h+"px";
        ct.innerHTML=data[i];
        cnewobj.appendChild(ct);
    }
    newobj.appendChild(cnewobj);



    var ncobj=$(id).childNodes[0];
    var hand = new IScroll('#'+id, {});
    hand.scrollToElement(ncobj.childNodes[hlen-bc],0);//把第28个子节点置顶，其实就相当于把00放在中心点
    my.selectvalue=ncobj.childNodes[hlen].innerHTML;



    function n_init()
    {
        if(nqt)
        {
            nqt=false;
            if(ntb>_ntb)
            {
                for(var i=0;i<(hlen-np);i++)
                {
                    ncobj.insertBefore(ncobj.lastChild,ncobj.firstChild);
                }
            }
            else
            {
                for(var i=0;i<(np-hlen);i++)
                {
                    ncobj.appendChild(ncobj.firstChild);
                }
            }
            hand.scrollToElement(ncobj.childNodes[hlen-bc],0);
            hand.refresh();
            my.selectvalue=ncobj.childNodes[hlen].innerHTML;
            ncobj.childNodes[hlen].style.fontWeight = "bold";
        }
    }

    var nw=parseInt(ncobj.offsetHeight);//整个列表的高度

    var nqt=false;//判断是拉动事件结束还是吸附中心点的事件结束
    var np=0;
    var ntb=(parseInt(nw/2)-120*X);//计算出原本边界离隐藏的区域的边界的距离，这个值是固定的
    var _ntb=0;
    hand.on("scrollCancel",function(){//按紧时重置下列表与中心点
        n_init();
    });
    hand.on("scrollStart",function(){//快速向下或向上操作时，需要重置滚动标识，避免列表的重置，等真正停止时才重置列表与中心点
        nqt=false;
        ncobj.childNodes[hlen].style.fontWeight = "";
    });
    hand.on("scrollEnd",function(){
        //   alert(this.bc)
        if(!nqt)
        {
            nqt=true;//设置滚动结束标识
            var _v=hand.y;//向下或向上滚动时所隐藏的最大距离，注意，就算是视觉上向上向上滚动了相同的距离，但在iscroll的minutehand.y看来，是不同相的，也基于此可以判断出滚动方向
            _ntb=Math.abs(_v);//绝对化_v值也就是滚动距离后，可以直接与tb进行判断，tb>_tb，就是向上滚动，反之就是向下
            var t=(Math.abs(_v)+150*X);//该距离的绝对值加一半个界面的高度，可得出距离中心点的滚动距离
            np=parseInt(t/(60*X));//该滚动距离对列表高度相除，，可算出中心点当前滚动了多少个列表也就是p值
            var nm=Math.abs(t%(60*X)*10+300);//划动停止后，需要定位到中心点的列表与中心点有一定的偏差，这个m值是列表吸附到中心点所需要的毫秒数
            hand.scrollToElement(ncobj.childNodes[np-bc],nm);//最大滚动距离到中心点的列表数为p，但事实上，iscroll在定位中心点时，只需要把离中心点p-2位置的列表定位在边界上，看上去，就是想要的列表放在了中心点的位置
            //this.selectvalue=ncobj.chhlenildNodes[].innerHTML;

        }
        else
        {
            n_init();
        }
    });

}