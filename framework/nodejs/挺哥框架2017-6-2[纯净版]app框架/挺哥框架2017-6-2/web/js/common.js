/*
 * lee
 */
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}



function parseUrl(url) {
    var reg = /\?([\w|=|&|-]+)/;
    if(reg.test(url)) {
        var result= {};
        var params1 = url.match(reg)[1];
        console.log(params1)
        var params = url.match(reg)[1].split("&");
        console.log(params1[1])
        for(var i=0;i<params.length;i++) {
            var _para = params[i].split("=");
            result[_para[0]] = _para[1];
        }
        return params1;
    }
}



function request(paras) {

    var url = window.location + "";

    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");

    var paraObj = {}

    for (i = 0; j = paraString[i]; i++) {

        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);

    }

    var returnValue = paraObj[paras.toLowerCase()];

    if (typeof (returnValue) == "undefined") {

        return "";

    } else {

        return returnValue;

    }

}

