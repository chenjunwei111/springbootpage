(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.stylemap = global.stylemap || {})));
}(this, (function (exports) {
    'use strict';

    /*
    样式名 相对应图层name
     */
    var styleName = {
        UCMRGRID: 'MR电平栅格',
        UCSMRGRID: 'MR_RSRP栅格',
        USERMRGRID: 'USER_RSRP栅格',
        POSITION: "定位",
        FLAG: "标识",
        HOTCLUSTER:'热点簇',
        WARNING_AREA:'预警区域',
        MONITORCLUSTERS:'监控簇',
        MONITORCLUSTER:'监控单簇',
        SECTOR_COLOR:'小区颜色',
    };

    var colorimg=[];

    /*
        红:#FF0000 255，0，0 黄:#FFFF00 255，255，0 蓝:#0000FF 0，0，255 橙:#FFA500 255,165,0 绿: #00FF00 0，255，0 靛:#6600FF 102,0,255  紫:#A757A8 128, 0, 255 暗红:#8b0000 139,0,0
    eqp:[号的位置 [,):L (,]:R [,]:A (,):N  Other:O
     */
    function getColor(stype) {
        if (stype == styleName.HANDOVER) {
            return ["ffa500"];
        }
        else if(stype == styleName.SECTOR_COLOR){
            var s =
                [
                    {
                        text: "黄色预警",
                        style: "ffff00",
                        max: 7,
                        min: 5,
                        eqp: 'A'
                    },
                    {
                        text: "橙色预警",
                        style: "ffa500",
                        max: 5,
                        min: 3,
                        eqp: 'A'
                    },
                    {
                        text: "红色预警",
                        style: "ff0000",
                        max: 3,
                        min: 1,
                        eqp: 'R'
                    },
                ];
            return s;
        }
        else if (stype == styleName.POSITION) {
            return ["ff0000"];
        }
        else if (stype == styleName.UCMRGRID||stype == styleName.UCSMRGRID||styleName.USERMRGRID) {
            var s =
                [
                    {
                        text: "[-140,-110]",
                        style: "FF0000",
                        max: -110,
                        min: -140,
                        eqp: 'A'
                    },
                    {
                        text: "[-110,-105]",
                        style: "FFC000",
                        max: -105,
                        min: -110,
                        eqp: 'A'
                    },
                    {
                        text: "(-105,-95]",
                        style: "FFFF00",
                        max: -95,
                        min: -105,
                        eqp: 'R'
                    },
                    {
                        text: "(-95,-85]",
                        style: "0000FF",
                        max: -85,
                        min: -95,
                        eqp: 'R'
                    },
                    {
                        text: "[-85,-47]",
                        style: "00E100",
                        max: -47,
                        min: -85,
                        eqp: 'A'
                    }
                ];
            return s;
        }
    }

    function getstyle(flag) {
        switch (flag) {
            case styleName.POSITION:
            case styleName.FLAG:
                return lyrmgr.LType.SYMBOLMAP;
            case   styleName.UCMRGRID:
            case   styleName.UCSMRGRID:
            case   styleName.USERMRGRID:
                return lyrmgr.LType.GRIDMAP;
            default:
                return lyrmgr.LType.STYLEMAP;
        }
    }

    var getName = function (name) {
        for (var key in styleName) {
            if (styleName[key] == name)
                return key;
        }
        return name;
    }

    /*
 获取颜色编号
 value：值
 typearr:颜色数组
  */
    var getRangeStype = function (value, typearr) {
        var styles;
        $.each(typearr, function (k, v) {
            if (v.eqp === "L") {
                if (v.min <= value && v.max > value) {
                    styles = v.style;
                    return false;
                }
            }
            else if (v.eqp === "R") {
                if (v.min < value && v.max >= value) {
                    styles = v.style;
                    return false;
                }
            }
            else if (v.eqp === "A") {
                if (v.min <= value && v.max >= value) {
                    styles = v.style;
                    return false;
                }
            }
            else if (v.eqp === "N") {
                if (v.min < value && v.max > value) {
                    styles = v.style;
                    return false;
                }
            }
            else if (v.eqp === "O") {
                styles = v.style;
                return false;
            }
        });
        return styles;
    }

    /*
  增加网格样式
  data：数组 包含LNG,LAT,GQUOTA属性,若需显示信息，则增加SMSG属性；若事件显示信息，则增加CMSG属性
  options:{
  showmsg:false//是否在网格上显示信息
  callback:function(e)//回调事件
  width:宽度(m)
  height:高度(m)
  opacity :透明度0~1,
  lgdname://图例
  }
  styleName:stylemap.SName

  return 0 无数据 1 正常 -1 错误
   */
    var setGridStyle = function (data, options, sName) {
        lyrmgr.delMapLayerbyName(sName);

        if (!data || data.length == 0)
            return 0;
        var c = getColor(sName);
        if (!c)
            return -1;
        var _data = [];
        console.log(data.length);
        $.each(data, function (i, o) {
            if (o.GQUOTA && o.GQUOTA != 'undefined') {
                var f = getRangeStype(parseFloat(o.GQUOTA), c);
                var coord = coordtransform.wgs84tobd09(o.LNG, o.LAT);
                _data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [coord.lng, coord.lat]
                    },
                    fillStyle: "#" + f,
                    showMsg: o.SMSG,
                    text: o.CMSG
                });
            }
        });
        var op = {
            // fillStyle: 'rgba(55, 50, 250, 0.8)',
            // shadowColor: 'rgba(255, 250, 50, 1)',
            // shadowBlur: 20,
            globalAlpha: options.opacity,
            label: {
                show: options.showmsg,
                fillStyle: 'black',
                // shadowColor: 'yellow',
                // font: '20px Arial',
                // shadowBlur: 10,
            },
            draw: 'grid', unit: 'm',
            height: options.height,
            width: options.width,
            zIndex: 999
        }
        if (options.callback) {
            op.methods = {
                click: function (e) {
                    options.callback(e);
                }
            }
        }
        lyrmgr.addMapLayer(_data,
            {
                mname: sName,
                mtype: getstyle(sName),
                options: op, mpos: true
            });
        if (options.lgdname) {
            Legends.AddLegend(sName, options.lgdname, c);
        }
        _data.splice(0, _data.length);
        return 1;
    }

    var setPointStyle = function (data, options, sName) {
        lyrmgr.delMapLayerbyName(sName);
        if (!data || data.length == 0)
            return 0;
        var c = getColor(sName);
        if (!c)
            return -1;
        var _data = [];
        console.log(data.length);
        $.each(data, function (i, o) {
            if (o.GQUOTA && o.GQUOTA != 'undefined') {
                var f = getRangeStype(parseFloat(o.GQUOTA), c);
                var coord = coordtransform.wgs84tobd09(o.LNG, o.LAT);
                // var rlng=coord.lng.toFixed(6).substring(coord.lng.toFixed(6).length-1)>5?coord.lng+0.00001:coord.lng+0.00002
                // var rlat=coord.lat.toFixed(6).substring(coord.lng.toFixed(6).length-1)>5?coord.lng+0.00001:coord.lng+0.00002
                console.log("aaaa");
                _data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [Math.random()*0.0001+coord.lng,Math.random()*0.0001+coord.lat]
                    },
                    fillStyle: "#" + f,
                    showMsg: o.SMSG,
                    text: o.CMSG
                });
            }
        });
        var op = {
            globalAlpha: options.opacity,
            label: {
                show: options.showmsg,
                fillStyle: 'black',
                // shadowColor: 'yellow',
                // font: '20px Arial',
                // shadowBlur: 10,
            },
            draw: 'simple',
            size: options.size,
            zIndex: 999
        }
        if (options.callback) {
            op.methods = {
                click: function (e) {
                    options.callback(e);
                }
            }
        }
        lyrmgr.addMapLayer(_data,
            {
                mname: sName,
                mtype: getstyle(sName),
                options: op, mpos: true
            });
        if (options.lgdname) {
            Legends.AddLegend(sName, options.lgdname, c);
        }
        _data.splice(0, _data.length);
        return 1;
    }

    /*
   * 设置范围值样式
   * item  key-小区 value-值
   * settype 类型项
   * legend 图例名 不显示不传值
   * label 标注选项 {name:,offset:{x,y},size:,font:'18px Arial',style: 'yellow',shadow:{color:'yellow',blur:10}}
   */
    var setRangeSectorStyle = function (item, stylesName, legendname,label) {

        lyrmgr.delMapLayerbyType(lyrmgr.LType.STYLEMAP);

        var session = sectormap.getSectorSession();
        if (!item || !session)
            return;
        setColorImg();
        if (!colorimg)
            return;
        var color = getColor(stylesName);
        if (!color)
            return;
        var datas = lyrmgr.getMapLayerbyType(lyrmgr.LType.SECTORMAP);
        if (!datas)
            return;
        var styledata=[];
        for (var i in item) {
            var _item = item[i];
            var sec = session[_item.key];
            if (sec) {
                $.each(datas, function (idx, data) {
                    var newdata = lyrmgr.getLayer(data.mcode).dataSet._data;
                    if (!newdata || sec >= newdata.length)
                        return false;
                    var _data = newdata[parseInt(sec)];
                    if (_data.text == _item.key) {
                        var imgname = getRangeStype(_item.value, color);
                        if (imgname) {
                            styledata.push({
                                geometry: {
                                    type: 'Point',
                                    coordinates: _data.geometry.coordinates
                                },
                                deg: _data.deg,
                                icon: colorimg[imgname],
                                text:_item.value
                            });
                        }
                    }

                })
            }
        }

        if (styledata && styledata.length > 0) {
            lyrmgr.addMapLayer(styledata, {
                mname: stylesName,
                mtype: getstyle(stylesName),
                options: lyrmgr.getLayer(datas[0].mcode).options,
                mpos:false,
                label:label
            });
            styledata.slice(0, styledata.length);
            //显示图例
            // if (legendname)
            //     Legend.AddLegend(stylesName, legendname, color);
        }
        datas.splice(0, datas.length);
        colorimg = {};
        //地图定位
    }


    function setColorImg() {
        var zoom ='-'+ sectormap.getfilename()+'-';
        if (!zoom)
            return;
        var clr=['00ff00','8b0000','6600ff','a757a8','ff0000','ffa500','ffff00','0000ff']
        for (var k in clr ) {
            var Img = new Image();
            Img.src = '../../images/map/style/sector' + zoom +clr[k] + '.png';
            colorimg[clr[k]] = Img
        }
    }

    /*
    设置标识物信息
    points:[{bmPiont:point,deg:dir}] 平面坐标点x y
    styleName:styleName
     */
    function setFlagOverlayStyle(points, isoffset) {
        if (!points)
            return;
        var pArray = [];
        var img = new Image();
        img.src = '../../images/map/symbols/mark_r.png';//flagv2832
        var z = basemap.mapvw.getZoom();
        if (isoffset) {
            var off = {x: 9, y: 12};
            if (z > 14) {
                off = {x: 15, y: 15};
            }
        }
        else {
            off = {x: 0, y: 0};
        }

        var p = new PjComm.PjMapData(basemap.mapvw);
        p.SetOffsetPoint(points, off)
        $.each(points, function (a, b) {
            pArray.push({
                geometry: {
                    type: 'Point',
                    coordinates: [b.ofslng, b.ofslat],
                },
                deg: 359,
                icon: img,
                text: p.text
            });
        })
        if (pArray.length > 0) {
            lyrmgr.delMapLayerbyName(styleName.FLAG);
            lyrmgr.addMapLayer(pArray,
                {
                    mname: styleName.FLAG,
                    mtype: getstyle(styleName.FLAG),
                    options: {
                        draw: 'icon',
                        height: 64,
                        coordType: 'bd0911',
                        zIndex: 1003,
                        points: points
                    },
                    mpos: false
                });
            pArray.splice(0, pArray.length);
        }
        ;
        //  return rtnAry;
    }

    exports.SName = styleName;
    exports.getName = getName;
    exports.setGridStyle = setGridStyle;
    exports.getstyle = getstyle;
    exports.getColor = getColor;
    exports.setFlagOverlayStyle = setFlagOverlayStyle;
    exports.setPointStyle=setPointStyle;
    exports.setRangeSectorStyle=setRangeSectorStyle;
    Object.defineProperty(exports, '__esModule', {value: true});
})));