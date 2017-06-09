/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 12-9-23
 * Time: 上午6:10
 * To change this template use File | Settings | File Templates.
 */
/*--------------

 作者:Tennt

 --------------*/
function Tqueue() {
    var _CloseID = 0;//列队执行时返回的ID，对此ID进行取消，列队暂停,同时为0时也可以判断当前列队不在执行中
    var _objLD = []; //列队序列，保存所有请求
    var __obj = null;//保存列队当前正在执行的任务
    var _one = -1; //保存列队第一次开始时（包括暂停后开始）取得的计时数
    var _isp = true;//暂停标志,这里需要判断，虽然暂停了，但当前的任务是否执行完没有
    var cs = function ()//列队核心
    {
        _CloseID = setTimeout(function () {
            if (_isp) {//从中止开始的，判断
                __obj = _objLD.shift(); //从任务列队出一个任务出来
            }
            __obj[1](__obj); //取出一个请求并执行
            if (_objLD.length > 0)//列队里还有任务就继续执行
            {
                _isp = true;
                _CloseID = setTimeout(arguments.callee, __obj[0]);
            }
            else {
                __obj[2](__obj); //执行完成列队的函数
                _CloseID = 0; //处理完毕,更改标识符
            }
        }, _one);
    }
    var cy = function ()//列队核心,循环
    {
        _CloseID = setTimeout(function () {
            if (_isp) {//从中止开始的，判断
                __obj = _objLD.shift(); //从任务列队出一个任务出来

                __obj[1](__obj); //取出一个请求并执行
                _objLD.push(__obj); //把执行完的任务又放在尾部
                if (_objLD.length > 0)//列队里还有任务就继续执行
                {
                   // _isp = true;
                    _CloseID = setTimeout(arguments.callee, __obj[0]);
                }
            }
        }, _one);
    }
    this.Start = function ()//增加一个任务后开始处理列队
    {
        if (_one == -1) {
            _one = arguments[0];
        }
        _objLD.push(arguments); //压一个任务进列队
        if (_CloseID==0)//如果列队不在处理中，就重新开启
        {
            cs();
        }
    }
    this.Push=function ()//增加一个任务后不处理列队
    {
        if (_one == -1) {
            _one = arguments[0];
        }
        _objLD.push(arguments); //压一个任务进列队
    }
    this.Pause = function () {//暂停列队
        if (_CloseID != 0) {
            clearTimeout(_CloseID);
            _isp = false;
            _CloseID = 0;
        }
    }
    this.Continue = function () {//继续暂停的列队
        if (_CloseID == 0) {
            if (_objLD.length > 0) {
             //   _isp = true;   不知要不要加20130923
                cs();
            }
        }
    }
    this.Cycle = function () {//继续暂停的列队
        if (_CloseID == 0) {
            if (_objLD.length > 0) {
                cy();
            }
        }
    }
    this.Stop = function () { //取消列队
        _isp=false;//此处先阻止列队执行;
        if (_CloseID != 0) {
            clearTimeout(_CloseID);
            _CloseID = 0; //设置列队可开启标志
            _objLD = [];//清空任务列队
        }
    }
    this.len = function () { //判断列队还有几个任务在执行;
        return _objLD.length;
    }
    this.Lid = function () { //判断列队还有几个任务在执行;
        return _CloseID;
    }
}