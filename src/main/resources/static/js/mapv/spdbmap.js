var hasLoaded = false;
$(function() {
    if (jQuery == "undefined") {
        loadScript('../../js/common/jquery-3.1.1.js?ver=1', addJs);
    } else {
        addJs();
    }
});
function waitjs(k, f) {
    var t = setInterval(function() {
        if (jsl && k in jsl && jsl[k] == 'success') {
            clearInterval(t);
            if (f && typeof f == 'function') {
                f();
            }

        }
    }, 1)
}

var jsl = {};
var $map = -1;
function addJs() {
    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/maptools.css"
    }).appendTo("head");

    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/web.contextmenu.css"
    }).appendTo("head");

    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/spdbmap.css"
    }).appendTo("head");
    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/Legend.css"
    }).appendTo("head");
    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/mtool.css"
    }).appendTo("head");
    $("<link>").attr({
        rel : "stylesheet",
        type : "text/css",
        href : "../../css/mapv/maptree.css"
    }).appendTo("head");

    $
        .getScript(
            "https://api.map.baidu.com/getscript?v=2.0&ak=1XjLLEhZhQNUzd93EjU5nOGQ&services=&t=&",
            function(r, s) {
                if (s == "success") {
                    $map = 0;
                  
                    //$.getScript("../../js/mapv/mapv.js");
                    $.getScript("../../js/mapv/mapv.js",
                          function(r, s) {
                              jsl["mapv"] = s;// S:"success",
                              // "notmodified",
                              // "error",
                              // "timeout" 或
                          });
                    $.getScript("../../js/mapv/UCMap.js",
                        function(r, s) {
                            jsl["UCMap"] = s;// S:"success",
                            // "notmodified",
                            // "error",
                            // "timeout" 或
                        });
                }
            }).fail(function() {
        $map = 1;
        $.getScript(" ../../js/olmap/olm-component.js", function() {
            $.getScript("../../js/mapv/mapv.js", function() {
                $.getScript("../../js/mapv/UCMap.js", function(r, s) {
                    jsl["UCMap"] = s;// S:"success", "notmodified",
                    // "error", "timeout" 或
                });
            });
        });
    });
    $.getScript("../../js/mapv/LMap.js");

    $.getScript("../../js/mapv/basemap.js");
    $.getScript("../../js/mapv/mapcutter.js");
    $.getScript("../../js/mapv/coordtransform.js");
    $.getScript("../../js/mapv/sectormap.js");
    $.getScript("../../js/mapv/layermanager.js");
    $.getScript("../../js/common/contextmenu.js");
    $.getScript("../../js/common/jquery-ui.js");
    $.getScript("../../js/mapv/MeasureTool.js");
    $.getScript("../../js/mapv/stylemap.js");
    $.getScript("../../js/mapv/Legend.js");
    $.getScript("../../js/mapv/Legends.js");
    $.getScript("../../js/mapv/maptools.js");
    $.getScript("../../js/mapv/maptree.js");
    $.getScript("../../js/mapv/mapLabel.js");
    $.getScript("../../js/mapv/commdiv.js", function(r, s) {
        jsl["commdiv"] = s;// S:"success", "notmodified", "error", "timeout" 或
        // "parsererror"
    });
    $.getScript("../../js/mapv/PjComm.js");

    $.getScript("../../js/mapv/RectangleZoom_min.js");
    $.getScript("../../js/mapv/rightkey.js");
    // $.getScript("../../js/mapv/mapLabel.js");

    $.getScript("../../js/mapv/geoMapTool.js");
    $.getScript("../../js/mapv/mapGeometry.js");

    // $.getScript("../../js/mapv/UCMap.js", function (r, s) {
    // jsl["UCMap"] = s;// S:"success", "notmodified", "error", "timeout" 或
    // });
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof (callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded"
                    || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
    }
    script.src = url;
    document.body.appendChild(script);
}

function exismap() {
    var js = "api.map.baidu.com";
    var sr = "services=&t=";
    var es = document.getElementsByTagName('script');
    for (var i = 0; i < es.length; i++)
         var _es = es[i]['src'];
    if (_es.indexOf(js) > 0 && _es.indexOf(sr) > 0)
        return true;
    return false;
}
