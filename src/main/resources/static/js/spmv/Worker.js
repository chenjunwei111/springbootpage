//importScripts("*.js")
(function () {
    // var xmlHttp = GetXmlHttpObject()
    // if (xmlHttp == null) {
    //         alert("您的浏览器不支持AJAX！");
    //         return;
    //     }

    onmessage=function (evt) {
       f(evt.data)
    }

    var f=function (j) {
        var _j=JSON.parse(j);
        var r = _j.r.sw.lng + ',' + _j.r.sw.lat + ',' + _j.r.ne.lng + ',' + _j.r.ne.lat
        console.log('..get..'+_j.g)
        var ajax=new XMLHttpRequest();
        ajax.open("GET",'/userperce/MapCaches/get?cid='+_j.g+'&ranges='+r+'&tag='+_j.t
            +'&rnd='+(new Date()).getTime());//同异步
        ajax.send();
        ajax.onreadystatechange=function()
        {
            console.log(_j.g+'--'+ajax.readyState+'..'+ajax.status)

            if(ajax.readyState==4&&ajax.status==200)
            {
                if(ajax.responseText)
                {
                    postMessage(JSON.parse(ajax.responseText));
                   // return JSON.parse(ajax.responseText)
                }
            }
        }
    }

    function GetXmlHttpObject() {
        var xmlHttp = null;
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xmlHttp;
    }
})()