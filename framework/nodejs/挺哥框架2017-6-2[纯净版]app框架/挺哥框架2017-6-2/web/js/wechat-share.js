"use strict"
;(function () {

  var extend = function (a, b) {
    var i = ''
    b = b || {}
    for (i in b) {
      a[i] = b[i]
    }
    return a
  }
  
  var isAppend = false
  
  var wechatShare = {
    isInWechat: function () {
      return /MicroMessenger/i.test(navigator.userAgent)
    },
    dataForWeixin: {
      imgUrl: 'https://lhyy.ikanghu.cn/images/logo.png',
      link: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2856adfb7b1d92cb&redirect_uri=http%3a%2f%2fwmt.fenxiangqu.cn%2fsc%2flhyy.html%3ffrom%3d%26isappinstalled%3d%26extenNum%3d&response_type=code&scope=snsapi_base&state=gh_b4e076d9a574#wechat_redirect",
      title: "联合用药",
      desc: "华嵘健康科技联合用药是一款具有专业性，指导性的服务平台，主要帮助病人能够便捷的挑选到合适的药物，通过联合用药的方式得到更好的治疗效果",
      dataUrl: "",
      success: function () { 
          // 用户确认分享后执行的回调函数
      },
      cancel: function () { 
          // 用户取消分享后执行的回调函数
      }
    },
    update: function (arg) {
      this.dataForWeixin = extend(this.dataForWeixin, arg || {})
    },
    _addListener: function () {
      wx.onMenuShareAppMessage(this.dataForWeixin)
      wx.onMenuShareTimeline(this.dataForWeixin)
      wx.onMenuShareQQ(this.dataForWeixin)
      wx.onMenuShareWeibo(this.dataForWeixin)
    },
    bind: function () {
      var that = this
      if (wx && wx.ready) {
        wx.ready(function(){
          that._addListener()
        })
      }
    },
    ini: function (appId, nonceStr, timestamp, signature) {
      //alert(appId, nonceStr, timestamp, signature)
      if (typeof signature === 'undefined' || typeof timestamp === 'undefined' || typeof nonceStr === 'undefined' || typeof appId === 'undefined') {return}
      
      if (!window.wx && !isAppend) {
        var s = document.createElement('script')
        s.src = '../js/jweixin-1.0.0.js'
        document.body.appendChild(s)
        isAppend = true
      }
      
      if (!window.wx) {
        setTimeout(function () {
          wechatShare.ini(appId, nonceStr, timestamp, signature)
        }, 1000)
      } else {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
        })
        this.bind()
      }
    }
  }
  
  window.wechatShare = wechatShare

}())
