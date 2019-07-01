/** layui-v2.1.2 MIT License By http://www.layui.com */
;!function (e) {
    "use strict";
    var t = document, o = {modules: {}, status: {}, timeout: 10, event: {}}, n = function () {
        this.v = "2.1.2"
    }, r = function () {
        var e = t.scripts, o = e[e.length - 1].src;
        return o.substring(0, o.lastIndexOf("/") + 1)
    }(), a = function (t) {
        e.console && console.error && console.error("Layui hint: " + t)
    }, i = "undefined" != typeof opera && "[object Opera]" === opera.toString(), u = {
        layer: "modules/layer",
        laydate: "modules/laydate",
        laypage: "modules/laypage",
        laytpl: "modules/laytpl",
        layim: "modules/layim",
        layedit: "modules/layedit",
        form: "modules/form",
        upload: "modules/upload",
        tree: "modules/tree",
        table: "modules/table",
        element: "modules/element",
        util: "modules/util",
        flow: "modules/flow",
        carousel: "modules/carousel",
        code: "modules/code",
        jquery: "modules/jquery",
        mobile: "modules/mobile",
        "layui.all": "../layui.all"
    };
    n.prototype.cache = o, n.prototype.define = function (e, t) {
        var n = this, r = "function" == typeof e, a = function () {
            return "function" == typeof t && t(function (e, t) {
                layui[e] = t, o.status[e] = !0 
            }), this
        };
        return r && (t = e, e = []), layui["layui.all"] || !layui["layui.all"] && layui["layui.mobile"] ? a.call(n) : (n.use(e, a), n)
    }, n.prototype.use = function (e, n, l) {
        function s(e, t) {
            var n = "PLaySTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/;
            ("load" === e.type || n.test((e.currentTarget || e.srcElement).readyState)) && (o.modules[f] = t, d.removeChild(v), function r() {
                return ++m > 1e3 * o.timeout / 4 ? a(f + " is not a valid module") : void(o.status[f] ? c() : setTimeout(r, 4))
            }())
        }

        function c() {
            l.push(layui[f]), e.length > 1 ? y.use(e.slice(1), n, l) : "function" == typeof n && n.apply(layui, l)
        }

        var y = this, p = o.dir = o.dir ? o.dir : r, d = t.getElementsByTagName("head")[0];
        e = "string" == typeof e ? [e] : e, window.jQuery && jQuery.fn.on && (y.each(e, function (t, o) {
            "jquery" === o && e.splice(t, 1)
        }), layui.jquery = layui.$ = jQuery);
        var f = e[0], m = 0;
        if (l = l || [], o.host = o.host || (p.match(/\/\/([\s\S]+?)\//) || ["//" + location.host + "/"])[0], 0 === e.length || layui["layui.all"] && u[f] || !layui["layui.all"] && layui["layui.mobile"] && u[f]) return c(), y;
        if (o.modules[f]) !function g() {
            return ++m > 1e3 * o.timeout / 4 ? a(f + " is not a valid module") : void("string" == typeof o.modules[f] && o.status[f] ? c() : setTimeout(g, 4))
        }(); else {
            var v = t.createElement("script"), h = (u[f] ? p + "lay/" : o.base || "") + (y.modules[f] || f) + ".js";
            v.async = !0, v.charset = "utf-8", v.src = h + function () {
                var e = o.version === !0 ? o.v || (new Date).getTime() : o.version || "";
                return e ? "?v=" + e : ""
            }(), d.appendChild(v), !v.attachEvent || v.attachEvent.toString && v.attachEvent.toString().indexOf("[native code") < 0 || i ? v.addEventListener("load", function (e) {
                s(e, h)
            }, !1) : v.attachEvent("onreadystatechange", function (e) {
                s(e, h)
            }), o.modules[f] = h
        }
        return y
    }, n.prototype.getStyle = function (t, o) {
        var n = t.currentStyle ? t.currentStyle : e.getComputedStyle(t, null);
        return n[n.getPropertyValue ? "getPropertyValue" : "getAttribute"](o)
    }, n.prototype.link = function (e, n, r) {
        var i = this, u = t.createElement("link"), l = t.getElementsByTagName("head")[0];
        "string" == typeof n && (r = n);
        var s = (r || e).replace(/\.|\//g, ""), c = u.id = "layuicss-" + s, y = 0;
        return u.rel = "stylesheet", u.href = e + (o.debug ? "?v=" + (new Date).getTime() : ""), u.media = "all", t.getElementById(c) || l.appendChild(u), "function" != typeof n ? i : (function p() {
            return ++y > 1e3 * o.timeout / 100 ? a(e + " timeout") : void(1989 === parseInt(i.getStyle(t.getElementById(c), "width")) ? function () {
                n()
            }() : setTimeout(p, 100))
        }(), i)
    }, n.prototype.addcss = function (e, t, n) {
        return layui.link(o.dir + "css/" + e, t, n)
    }, n.prototype.img = function (e, t, o) {
        var n = new Image;
        return n.src = e, n.complete ? t(n) : (n.onload = function () {
            n.onload = null, t(n)
        }, void(n.onerror = function (e) {
            n.onerror = null, o(e)
        }))
    }, n.prototype.config = function (e) {
        e = e || {};
        for (var t in e) o[t] = e[t];
        return this
    }, n.prototype.modules = function () {
        var e = {};
        for (var t in u) e[t] = u[t];
        return e
    }(), n.prototype.extend = function (e) {
        var t = this;
        e = e || {};
        for (var o in e) t[o] || t.modules[o] ? a("模块名 " + o + " 已被占用") : t.modules[o] = e[o];
        return t
    }, n.prototype.router = function (e) {
        var t = this, e = e || location.hash, o = {path: [], search: {}, hash: (e.match(/[^#](#.*$)/) || [])[1] || ""};
        return /^#\//.test(e) ? (e = e.replace(/^#\//, "").replace(/([^#])(#.*$)/, "$1").split("/") || [], t.each(e, function (e, t) {
            /^\w+=/.test(t) ? function () {
                t = t.split("="), o.search[t[0]] = t[1]
            }() : o.path.push(t)
        }), o) : o
    }, n.prototype.data = function (t, o) {
        if (t = t || "layui", e.JSON && e.JSON.parse) {
            if (null === o) return delete localStorage[t];
            o = "object" == typeof o ? o : {key: o};
            try {
                var n = JSON.parse(localStorage[t])
            } catch (r) {
                var n = {}
            }
            return o.value && (n[o.key] = o.value), o.remove && delete n[o.key], localStorage[t] = JSON.stringify(n), o.key ? n[o.key] : n
        }
    }, n.prototype.device = function (t) {
        var o = navigator.userAgent.toLowerCase(), n = function (e) {
            var t = new RegExp(e + "/([^\\s\\_\\-]+)");
            return e = (o.match(t) || [])[1], e || !1
        }, r = {
            os: function () {
                return /windows/.test(o) ? "windows" : /linux/.test(o) ? "linux" : /iphone|ipod|ipad|ios/.test(o) ? "ios" : /mac/.test(o) ? "mac" : void 0
            }(), ie: function () {
                return !!(e.ActiveXObject || "ActiveXObject" in e) && ((o.match(/msie\s(\d+)/) || [])[1] || "11")
            }(), weixin: n("micromessenger")
        };
        return t && !r[t] && (r[t] = n(t)), r.android = /android/.test(o), r.ios = "ios" === r.os, r
    }, n.prototype.hint = function () {
        return {error: a}
    }, n.prototype.each = function (e, t) {
        var o, n = this;
        if ("function" != typeof t) return n;
        if (e = e || [], e.constructor === Object) {
            for (o in e) if (t.call(e[o], o, e[o])) break
        } else for (o = 0; o < e.length && !t.call(e[o], o, e[o]); o++) ;
        return n
    }, n.prototype.sort = function (e, t, o) {
        var n = JSON.parse(JSON.stringify(e));
        return t ? (n.sort(function (e, o) {
            var n = /^-?\d+$/, r = e[t], a = o[t];
            return n.test(r) && (r = parseFloat(r)), n.test(a) && (a = parseFloat(a)), r && !a ? 1 : !r && a ? -1 : r > a ? 1 : r < a ? -1 : 0
        }), o && n.reverse(), n) : n
    }, n.prototype.stope = function (t) {
        t = t || e.event, t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0
    }, n.prototype.onevent = function (e, t, n) {
        return "string" != typeof e || "function" != typeof n ? this : (o.event[e + "." + t] = [n], this)
    }, n.prototype.event = function (e, t, n) {
        var r = this, a = null, i = t.match(/\(.*\)$/) || [], u = (t = e + "." + t).replace(i, ""),
            l = function (e, t) {
                var o = t && t.call(r, n);
                o === !1 && null === a && (a = !1)
            };
        return layui.each(o.event[u], l), i[0] && layui.each(o.event[t], l), a
    }, e.layui = new n
}(window);

//封装load方法和信息弹出
    layui.use(['layer','jquery','laydate'], function() {
        var $ = layui.jquery //重点处
            ,layer = layui.layer;

        var laydate=layui.laydate
        $(function () {
            laydate.render({
                 elem: '#date' //指定元素
                // ,type: 'month'
                // , value: '2018-11'
            });
                $(".inputSector").mouseenter(function () {
                $(".clickX").removeClass("hide");
            })
            $(".inputSector").mouseleave(function () {
                $(".clickX").addClass("hide");
            })

            $(".date").attr("readonly",'');

            $("#main2").css("background","white");

            function isIE() { //ie?
                if (!!window.ActiveXObject || "ActiveXObject" in window)
                    return true;
                else
                    return false;
            }

            if(isIE()){
                console.log("IE")
                $(".SlectBox").css("display","inline-table");
                $(".SlectBox").css("width","150px");
                $(".SumoSelect").css("display","inline-table");
                $(".misangles").css("line-height","inherit");
            }


        })
    });


// function tips(str) {
//     layui.use('layer', function() {
//         layer = layui.layer;
//         layer.msg(str, {
//             icon: 16,
//             time: 1000, //1秒关闭（如果不配置，默认是3秒）
//             shade:0.1
//         });
//     });
// }

/*
yuan 提示
pos:显示的位置，默认右  1 上，3 下，4 左
 */
function tip(str,sid,pos) {
    layer.tips(str,sid, {
        tips: pos,
        time: 3000
    });
}




/*
提示模态框
 */
// function msg(msg) {
//     layer.msg(msg,
//         {
//             time: 2, //20s后自动关闭
//             btn: ['确定']
//         });
// }


// var thing=null;
// function loadStar(message) {
//     console.log("开始加载")
//     layui.use(['layer','jquery'], function() {
//         layer = layui.layer;
//     if(message==null){
//         thing=layer.msg("数据处理中，请稍候....", {
//             icon: 16,
//             time: 0, //1秒关闭（如果不配置，默认是3秒）
//         });
//     }else {
//         thing=layer.msg(message, {
//             icon: 16,
//             time: 0, //1秒关闭（如果不配置，默认是3秒）
//         });
//     }
//     });
// }
//
// function loadStop() {
//     layui.use(['layer','jquery'], function() {
//         layer = layui.layer;
//         layer.closeAll();
//     })
// }

function  reload() {
    location.reload();
}

function  clear1(elemenet) {
    var input=document.getElementById(''+elemenet+'');
    input.value='';
}



function strToBinary(str){
    var result = [];
    var list = str.split("");
    for(var i=0;i<list.length;i++){
        if(i != 0){
            result.push(" ");
        }
        var item = list[i];
        var binaryStr = item.charCodeAt().toString(2);
        result.push(binaryStr);
    }
    return result.join("");
}

// layui.use(['jquery'], function() {
//     var $ = layui.jquery //重点处
//     var userName=$('.userName', window.parent.document).val();
//     var city=$('.city', window.parent.document).text();
//     // window.setInterval(go, 1000);
//     // function go() {
//     //
//     // }
//     if(userName!=undefined){
//         $.ajaxSetup( {
//             headers: { // 默认添加请求头
//                 "user":strToBinary(userName) ,
//                 "city":strToBinary(city),
//                 "aaaaa":new Date().getTime()
//             } ,
//             // error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
//             //     alert( '发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg );
//             // }
//         } );
//     }
// });


function gisMove(id) {
    var width=   $("#"+id+"").width();
    if(width<10){
    }else {
        var a1= $('.layui-tab-item', window.parent.document).height()-35;
        $("#"+id+"").css("width","100%");
        $("#"+id+"").css("height",a1);
    }
}

function autodivheight(){
    //获取浏览器窗口高度
    var winHeight=0;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过深入Document内部对body进行检测,获取浏览器窗口高度
    if (document.documentElement && document.documentElement.clientHeight)
        winHeight = document.documentElement.clientHeight;
    //DIV高度为浏览器窗口的高度
//        document.getElementById("test").style.height= winHeight +"px";
  return winHeight;
}

