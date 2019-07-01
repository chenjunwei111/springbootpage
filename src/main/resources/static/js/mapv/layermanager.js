(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lyrmgr = global.lyrmgr || {})));
}(this, (function (exports) { 'use strict';

var lyrStorage=[];
    ($(function () {
        window.onunload=function () {
            if (lyrStorage)
                lyrStorage.splice(0, lyrStorage.length);
            lyrStorage = null;
            sectormap.clearSession();
            basemap.mapvw = null;
        }
    }));
    // $(window).unload(function(){
    //     //响应事件
    // });

    /*
    图层类别
     */
  var lyrType={
      STYLEMAP: "stylemap",//右键小区样式图层
      SECTORMAP: "sectormap",//小区图层
      GRIDMAP: "gridmap",//栅格图层
      SITEMAP: "sitemap",//基站图层
      SYMBOLMAP:"symbolmap",//标识图层
      LABELMAP:"labelmap",//文本图层
      DRAWMAP:"drawmap",//绘制图层
      TILESMAP:"tilesmap"//切图
      ,HEATMAP:"热力图"
  };
/*
data:数据点
moptions:
{
mname:stylemap.SName.styleName,
mtype:lyrmgr.LType.lyrType,
options:参数选项
}
 */
var addMapLayer=function(data,moptions) {
    if (!basemap.mapvw||!data||!moptions)
        return;
    if (data && moptions.options) {
        var mapvLayer = null;
        moptions.options.mcode = getMapCode();
        moptions.options.loadend = function () {
            if (moptions.mpos && moptions.mpos === true) {
                setMapSelfAdaption(moptions.mname);
            }
            mapvLayer = null;
           // basemap.mapvw.panBy(0, 1);
        }
        if (moptions.mtype == lyrType.GRIDMAP || moptions.mtype == lyrType.TILESMAP || moptions.mtype == lyrType.HEATMAP) {
            var dataSet = new ThmMaps.DataSet(data);
            mapvLayer = new ThmMaps.ThematicMapLayer(basemap.mapvw, dataSet, moptions.options);
        }
        else {
            var dataSet = new mapv.DataSet(data);
            mapvLayer = new mapv.baiduMapLayer(basemap.mapvw, dataSet, moptions.options);
        }
        addLayerStorage(moptions);
    }
}
/*
 opt=
    {
        strokeColor:linecolor, 线颜色
        fillColor:fillcolor,填充颜色
        fillOpacity:opacity,面透明度0-1
        strokeOpacity:opacity,线透明度0-1
        strokeStyle:pstyle,线样式 solid或dashed
        strokeWeight:weight, 线宽
        enableMassClear: false,
        enableEditing: false,
        enableClicking: false
    }
 */
var addGeoLayer=function(name,points,options,ltype,drawtype)
    {
        delMapLayerbyName(name);
        if(!basemap.mapvw)
            return;
        if(points&&options)
        {
            if(drawtype=="pline")
            {
                var line=new BMap.Polyline(points,options);
                basemap.mapvw.addOverlay(line);
                addLayerStorage(line,name,ltype);
            }
            else if(drawtype=="polygon")
            {
                var polygon=new BMap.Polygon(points,options);
                basemap.mapvw.addOverlay(polygon);
                addLayerStorage(polygon,name,ltype);
            }
        }
}

/*
保存图层信息
 */
var addLayerStorage=function(m)
{
	lyrStorage.push({
		name:m.mname,
		mtype:m.mtype,
        viewer:true,
        mcode:m.options.mcode,
        mlabel: m.label// {offset:{x,y},size:,font:'18px Arial',style: 'yellow',shadow:{color:'yellow',blur:10}}
	})
}

var getMapLayerbyName=function(name) {
    if (!lyrStorage)
        return;
    var a = [];
    $.each(lyrStorage, function (i, lyr) {
        if (lyr.name == name) {
           a.push(lyr);
        }
    })
    return a;
}

var getMapLayerbyType=function(mtype) {
    if (!lyrStorage)
        return;
    var maplayer = [];
    $.each(lyrStorage, function (idx, v) {
        if (v.mtype == mtype) {
            maplayer.push(v);
        }
    });
    return maplayer;
}

var delMapLayerbyName=function(name) {
    if (!basemap.mapvw)
        return;
    var lyr = getMapLayerbyName(name);
    if (lyr) {
        $.each(lyr, function (a, b) {
            var overlay = getLayer(b.mcode);
            if (overlay) {
                overlay.remove();
                overlay.dataSet.clear();
            }
            var li = getLyrStorageIdx(name);
            if (li && li >= 0) {
                lyrStorage.splice(li, 1);
            }
            Legends.CloseLegend(name);
            if (b.mtype == lyrmgr.LType.TILESMAP) {
                var c = new MapCutter();
                c.clearData();
            }
        })
    }
}

var delMapLayerbyType=function(mtype) {
    var lyrs = getMapLayerbyType(mtype);
    if (lyrs) {
        $.each(lyrs, function (idx, lyr) {
            var overlay=getLayer(lyr.mcode);
            if(overlay) {
                overlay.remove();
                overlay.dataSet.clear();
            }
            var li = getLyrStorageIdx(lyr.name);
            if(li&&li>=0) {
                lyrStorage.splice(li, 1);
            }
           Legends.CloseLegend(lyr.name);
        })
        if(mtype==lyrmgr.LType.TILESMAP) {
            var c = new MapCutter();
            c.clearData();
        }
    }
};

    var delMapLayerbyType2=function(mtype) {
        var lyrs = getMapLayerbyType(mtype);
        if (lyrs) {
            $.each(lyrs, function (idx, lyr) {
                var overlay=getLayer(lyr.mcode);
                if(overlay) {
                    overlay.remove();
                    overlay.dataSet.clear();
                }
                var li = getLyrStorageIdx(lyr.name);
                if(li&&li>=0) {
                    lyrStorage.splice(li, 1);
                }
            })
        }
    };

    var clearStyle = function (object) {
        if(object) {
            lyrmgr.delMapLayerbyType(object);
            lyrmgr.delMapLayerbyName(object);
            Legend.CloseLegend();
            return;
        }
        lyrmgr.delMapLayerbyType(lyrmgr.LType.STYLEMAP);
        lyrmgr.delMapLayerbyType(lyrmgr.LType.DRAWMAP);
        // lyrmgr.delMapLayerbyType(lyrmgr.LType.SYMBOLMAP);
        lyrmgr.delMapLayerbyType(lyrmgr.LType.GRIDMAP);
        lyrmgr.delMapLayerbyType(lyrmgr.LType.HEATMAP);
        //lyrmgr.delMapLayerbyType(lyrmgr.LType.TILESMAP);
        Legends.CloseLegend();
        // $("#sel-info-btn-id").attr("value", "选择小区");
    }

/*
更新
 */
var updMapDatabyName=function(name,data,options) {
    var a = getMapLayerbyName(name);
    if (a) {
        $.each(a,function (i,j) {
            var b = getLayer(j.mcode);
            if (b) {
                if (options) {
                    b.options = options;
                }
                if (data) {
                    b.dataSet.set(data);
                }
                basemap.UpdateMap(b);
                // b.canvasLayer.options.update();
            }
        })

    }
}

var updMapDatabyType=function(type,data,options) {
        var a = getMapLayerbyType(type);
        if (a) {
            $.each(a,function (b,c) {
                var d = getLayer(c.mcode);
                if (d) {
                    if (options) {
                       d.options = options;
                    }
                    if (data) {
                        d.dataSet.set(data);
                    }
                    basemap.UpdateMap(d);
                    //d.canvasLayer.options.update();
                }
            })
        }
    }

var updateMapLayerIndex=function(name)
{

}

var getLyrStorageIdx=function(name)
{
    if(!lyrStorage)
        return -1;
    var idx=-1;
    $.each(lyrStorage,function (i,o) {
        if(o.name===name)
        {
            idx=i;
            return false;
        }
    });
    return idx;
}

var getMapLayer=function () {
    return lyrStorage;
}

var clearMapLayer=function() {
    if (!basemap.mapvw)
        return;
    basemap.mapvw.clearOverlays();
    if (lyrStorage) {
        lyrStorage.splice(0, lyrStorage.length);
    }
}

var hideMapLayer=function(name) {
    //也可以从MAP获取
    //	var fdd=basemap.mapvw.getOverlayer();
    //	for(var i in fdd)
    //	{
    //		fdd[i].hide();
    //		fdd[i].show();
    //		fdd[i].isVisible();
    //	}
    var getlyr = getMapLayerbyName(name);
    if (getlyr) {
        $.each(getlyr,function (a,b) {
            b.ml.layer.hide();
        })
    }
}

var showMapLayer=function(name) {
    var getlyr = getMapLayerbyName(name);
    if (getlyr) {
        $.each(getlyr,function (a,b) {
            b.ml.layer.show();
        })
    }
}

function getMapCode() {
    return Math.random().toString(16).replace(".", "");
}

var getLayer=function (mcode) {
    return mapv.getLayer(basemap.mapvw, mcode);
}

var getLayerData=function (stylename) {
    var lyr = getMapLayerbyName(stylename);
    if (lyr) {
        var _data=[];
        $.each(lyr,function (i,b) {
            var data = getLayer(b.mcode).dataSet._data;
            if (data)
                _data= $.map(data, function (a) {
                    return [{lng: a.geometry.coordinates[0], lat: a.geometry.coordinates[1]}];
                })
        })
        return _data;
    }
}


function  setMapSelfAdaption(name) {
    var a = getLayerData(stylemap.SName.FLAG);
    var b = getLayerData(name);
    var f=null;
    if(a&&a.length>0) {
        f = a[0];
    }
    else if(b && b.length > 0) {
        var i = parseInt(Math.random() * b.length, 10);
        f = i == b.length ? b[i - 1] : b[i];
    }
    // var f = a && a.length > 0 ? a[0] : b && b.length > 0 ? b[0] : null;
    if (f == null)
        return;
    var m = {}

    var pj=new PjComm.PjMapData(basemap.mapvw);
    pj.GetMaxMinPoint(m, f.lng, f.lat);
    //pjconvert.getMaxMinPoint(m, f.lng, f.lat);
    var point = new BMap.Point(f.lng, f.lat);
    if (b) {
        $.each(b, function (i, j) {
            if (basemap.mapvw.getDistance(point, new BMap.Point(j.lng, j.lat)) < 10000) {
                pj.GetMaxMinPoint(m, j.lng, j.lat);
                //pjconvert.getMaxMinPoint(m, j.lng, j.lat);
            }
        })
    }
    var c = null;
    if (a&&a.length > 0) {
        c = new BMap.Point(a[0].lng, a[0].lat);
    }
    else {
        c = new BMap.Point((m.MaxLng + m.MinLng) / 2, (m.MaxLat + m.MinLat) / 2);
    }
    basemap.mapvw.setCenter(c);
    //var z = pjconvert.getZoomInBounds(m);
    var z = pj.GetZoomInBounds(m);
    basemap.mapvw.setZoom(z < 15 ? 15 : z);
}


exports.LType=lyrType;
exports.addMapLayer=addMapLayer;
exports.addGeoLayer=addGeoLayer;
exports.updateMapDataByType=updMapDatabyType;
exports.updateMapDataByName=updMapDatabyName;
exports.getMapLayerbyName=getMapLayerbyName;
exports.getMapLayerbyType=getMapLayerbyType;
exports.delMapLayerbyName=delMapLayerbyName;
exports.delMapLayerbyType=delMapLayerbyType;
exports.delMapLayerbyType2=delMapLayerbyType2;//WEI-该方法清空图层，不清楚图例
exports.clrMapLayer=clearMapLayer;
exports.hideMapLayer=hideMapLayer;
exports.showMapLayer=showMapLayer;
exports.getMapLayer=getMapLayer;
exports.getLayer=getLayer;
exports.getLayerData=getLayerData;
exports.getLyrStorageIdx=getLyrStorageIdx;
exports.clearStyle=clearStyle;
exports.addLayerStorage=addLayerStorage;

Object.defineProperty(exports, '__esModule', { value: true });
})));