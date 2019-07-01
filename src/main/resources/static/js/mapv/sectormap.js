(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.sectormap = global.sectormap || {})));
}(this, (function (exports) {
    'use strict';

    var sectorLPoint = [];
    var siteLPoint = [];
    var sectorGPoint = [];
    var siteGPoint = [];
    var isLoadfirst = true;
    var SectorSession = {};//保存下标 以便快速查找
    var index = 0;
    var gsmover=0;
    var site={};
    /*
    获取等级图片地址
     */
    var Getfilename = function (net,zoom) {
        if (!basemap.mapvw)
            return;
        var _zoom = zoom||basemap.mapvw.getZoom();
        if (_zoom <= 14) {
            if (!net||net == 4)
                return '2018';
            else if (net == 2)
                return '1412';
        }
        else {
            if (!net||net == 4)
                return '3026';
            else if (net == 2)
                return '2018';
        }
    }

    /*
    加载地图
     */
    var loadsectormap = function () {
        initMap();
        index = 0;
        var imgsector = new Image();
        imgsector.src = '../../images/map/symbols/sectorv' + Getfilename(4) + '.png';
        var imgsite = new Image();
        imgsite.src = '../../images/map/symbols/sitev.png';
        $.ajax({
            type: 'post',
            url: "/userperce/PLteSector/dynamicSqlMap",
            data: {
                cityCode: basemap.VMapCfg.mapCityCode,//,
                Date: basemap.VMapCfg.mapDate,//
                Lng: sectormap.ucpoint ? sectormap.ucpoint.lng : null,
                Lat: sectormap.ucpoint ? sectormap.ucpoint.lat : null,
            },//20170601
            error: function (e) {
                sectormap.ucpoint = {}
                $("#map-date-label-id").text("地图 无坐标数据");
                throw '地图扇区加载失败>>>' + e.message;
                return;
            },
            success: function (data) {
                if (!data || data.length == 0) {
                    $("#map-date-label-id").text("地图 无坐标数据");
                    return;
                }

                basemap.VMapCfg.mapDate=data[0].MDATE;
                getSiteData();

                var info = null;
                var spiltinfos = null;
                var splitinfo = null;

                for (var i = 0; i < data.length; i++) {
                    info = data[i].SECTORID;
                    if (info !== undefined) {
                        var coord = coordtransform.wgs84tobd09(data[i].LONGITUDE, data[i].LATITUDE);
                        loadSite(coord.lng, coord.lat, info, imgsite);
                        spiltinfos = info.split(",");
                        for (var j = 0; j < spiltinfos.length; j++) {
                            splitinfo = spiltinfos[j].split("|");
                            if (splitinfo.length == 2) {
                                loadSector(coord.lng, coord.lat, splitinfo[1], splitinfo[0], imgsector);
                            }
                        }
                    }
                }
                imgsector = null;
                isLoadfirst = false;
                if (basemap.VMapCfg.mapGDate) {
                    var k = setInterval(function () {
                        if (gsmover == true) {
                            addGLayer();
                            addLLayer();
                            basemap.callBack();
                            clearInterval(k)
                        }

                    }, 200)
                }
                else {
                    addLLayer();
                    basemap.callBack();
                }
                //delete  sectormap.ucpoint;
            }
        });

        if (basemap.VMapCfg.mapGDate) {
            //GSM
            var imggs = new Image();
            console.log(Getfilename(2))
            imggs.src = '../../images/map/symbols/sectorg' + Getfilename(2) + '.png';
            gsmover=false;
            $.ajax({
                type: 'post',
                url: "/userperce/PLteSector/dynamicSqlGsmMap",
                data: {
                    cityCode: basemap.VMapCfg.mapCityCode,//,
                    Date: basemap.VMapCfg.mapGDate,//
                    Lng: sectormap.ucpoint ? sectormap.ucpoint.lng : null,
                    Lat: sectormap.ucpoint ? sectormap.ucpoint.lat : null
                },//20170601
                error: function (e) {
                    gsmover=true;
                },
                success: function (data) {
                    if (!data || data.length == 0) {
                        gsmover=true;
                    //     $("#map-date-label-id").text("地图 无坐标数据");
                        return;
                    }
                    var info = null;
                    var spiltinfos = null;
                    var splitinfo = null;
                    for (var i = 0; i < data.length; i++) {
                        info = data[i].SECTORID;
                        if (info !== undefined) {
                            var coord = coordtransform.wgs84tobd09(data[i].LONGITUDE, data[i].LATITUDE);
                            loadGSMSite(coord.lng, coord.lat, info, imgsite);
                            spiltinfos = info.split(",");
                            for (var j = 0; j < spiltinfos.length; j++) {
                                splitinfo = spiltinfos[j].split("|");
                                if (splitinfo.length == 2) {
                                    loadGSMSector(coord.lng, coord.lat, splitinfo[1], splitinfo[0], imggs);
                                }
                            }
                        }
                    }
                    imggs = null;
                    gsmover=true;
                    // delete  sectormap.ucpoint;
                }
            });
        }
    }

    /*
     加载单个POI场景的小区地图
     */
    var loadsectormappoi = function (worktype,start,end,communityid) {
        //initMap();

        index = 0;
        var imgsector = new Image();
        imgsector.src = '../../images/map/symbols/sectorv3026.png';
        var imgsite = new Image();
        imgsite.src = '../../images/map/symbols/sitev.png';
        var url = "/userperce/PPoiSceneDetail/getPoiCell?worktype="+encodeURI(encodeURI(worktype))+"&start="+start+"&end="+end+"&communityid="+communityid;
        $.ajax({
            type: 'post',
            url: url,
            error: function (e) {
                sectormap.ucpoint = {}
                $("#map-date-label-id").text("地图 无坐标数据");
                throw '地图扇区加载失败>>>' + e.message;
                return;
            },
            success: function (data) {
                if (!data || data.length == 0) {
                    $("#map-date-label-id").text("地图 无坐标数据");
                    return;
                }

                //getSiteDataNew();
                var info = null;
                var spiltinfos = null;
                var splitinfo = null;

                for (var i = 0; i < data.length; i++) {
                    info = data[i].SECTORID;
                    if (info !== undefined) {
                        //if(i==0){
                        //    data[i].LONGITUDE=   102.724745	;
                        //    data[i].LATITUDE = 25.038844 ;
                        //}
                        var coord = coordtransform.wgs84tobd09(data[i].LONGITUDE, data[i].LATITUDE);
                        loadSite(coord.lng, coord.lat, info, imgsite);
                        spiltinfos = info.split(",");
                        for (var j = 0; j < spiltinfos.length; j++) {
                            splitinfo = spiltinfos[j].split("|");
                            if (splitinfo.length == 2) {
                                loadSector(coord.lng, coord.lat, splitinfo[1], splitinfo[0], imgsector);
                            }
                        }
                    }
                }
                imgsector = null;
                isLoadfirst = false;
                if (basemap.VMapCfg.mapGDate) {
                    var k = setInterval(function () {
                        if (gsmover == true) {
                            addGLayer();
                            addLLayer();
                            basemap.callBack();
                            clearInterval(k)
                        }

                    }, 200)
                }
                else {
                    addLLayer();
                    basemap.callBack();
                }
                //delete  sectormap.ucpoint;
            }
        });
    }

    function addLLayer() {
        if(siteLPoint.length>0&&sectorLPoint.length>0)
        {
           var LCopt = {
                mname: "扇区",
                mtype: lyrmgr.LType.SECTORMAP,
                options: {
                    draw: 'icon',
                    height: 52,
                    coordType: 'bd0911',
                    zIndex: 1001
                    //coordType:'bd09mc'
                },
                // label:{
                //     offset:{x:15,y:21},
                //     // style:'red',
                //     name:'小区名',
                //     font:'13px Arial'
                // }
            };
            var LSopt = {
                mname: "基站",
                mtype: lyrmgr.LType.SITEMAP,
                options: {
                    draw: 'icon',
                    coordType: 'bd0911',
                    methods: {
                        mousemove: function (e) {
                            // console.log(e);
                            showenb(e);
                            //addMapRightKey(item, e);
                        },
                        rightclick: function (item, e) {
                            // console.log(e);
                            addMapRightKey(item, e);
                        }
                    },
                    height: 10,
                    width: 10,
                    size: 10,
                    zIndex: 1000
                },
                //   label:{
                //     offset:{x:0,y:0},
                //     name:'基站名',
                //     font:'13px Arial',
                //     data:getSiteData
                // }
            };
            lyrmgr.addMapLayer(siteLPoint, LSopt);
            lyrmgr.addMapLayer(sectorLPoint, LCopt);

            var L = new Legend();
            L.add({m: {f: '#00A9EF', t: '基站'}, k: 'E'})
            L.add({m: {f: '../../images/map/symbols/sectorv' + Getfilename(4) + '.png', t: 'LTE小区'}, k: 'Y'})

            $("#map-date-label-id").text("地图 " + basemap.VMapCfg.mapDate);
        }
        //清空数组
        if (sectorLPoint.length > 0)
            sectorLPoint.splice(0, sectorLPoint.length);
        if (siteLPoint.length > 0)
            siteLPoint.splice(0, siteLPoint.length);
    }

    function addGLayer() {
        if(siteGPoint.length>0&&sectorGPoint.length>0)
        {
            var GCopt = {
                mname: "GSM扇区",
                mtype: lyrmgr.LType.SECTORMAP,
                options: {
                    draw: 'icon',
                    height: 36,
                    coordType: 'bd0911',
                    zIndex: 1002
                    //coordType:'bd09mc'
                }
            };
            var GSopt = {
                mname: "GSM基站",
                mtype: lyrmgr.LType.SITEMAP,
                options: {
                    draw: 'icon',
                    coordType: 'bd0911',
                    height: 10,
                    width: 10,
                    size: 10,
                    zIndex: 999
                }
            };
            lyrmgr.addMapLayer(siteGPoint, GSopt);
            lyrmgr.addMapLayer(sectorGPoint, GCopt);

            var L = new Legend();
            L.add({m: {f: '#00A9EF', t: '基站'}, k: 'E'})
            L.add({m: {f: '../../images/map/symbols/sectorg' + Getfilename(2) + '.png', t: 'GSM小区'}, k: 'C'})
        }
        //清空数组
        if (sectorGPoint.length > 0)
            sectorGPoint.splice(0, sectorGPoint.length);
        if (siteGPoint.length > 0)
            siteGPoint.splice(0, siteGPoint.length);
    }

    //基站标注
    function getSiteData(data) {
        $.ajax({
            type: 'post',
            url: "/userperce/PLteSector/getSiteName",
            data: {
                cityCode: basemap.VMapCfg.mapCityCode,//,
                Date: basemap.VMapCfg.mapDate,//
            },
          //  async: false,
            error: function (e) {

            },
            success: function (rsl) {
                if (!rsl || rsl.length == 0) {
                    return;
                }
                $.each(rsl, function (a, b) {
                    // var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
                    // data.push({lng: c.lng, lat: c.lat, deg: 0, text: b.ENODEB_NAME})

                    if(!(this.ENODEBID in site))
                    site[this.ENODEBID]=this.ENODEB_NAME;
                });
            }
        });

    }
    //加载全网的基站速度，指定一些数据呈现
    function getSiteDataNew(data) {
        $.ajax({
            type: 'post',
            url: "/userperce/PLteSector/getSiteName",
            data: JSON.stringify(data),
            contentType: 'application/json',
            //  async: false,
            error: function (e) {

            },
            success: function (rsl) {
                if (!rsl || rsl.length == 0) {
                    return;
                }
                $.each(rsl, function (a, b) {
                    // var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
                    // data.push({lng: c.lng, lat: c.lat, deg: 0, text: b.ENODEB_NAME})

                    if(!(this.ENODEBID in site))
                        site[this.ENODEBID]=this.ENODEB_NAME;
                });
            }
        });

    }

    function loadSector(lon, lat, dir, sector, img) {
        sectorLPoint.push({
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
            deg: dir,
            icon: img,
            text: sector,
            net: 4
        });
        //保存小区下标数组
        // sessionStorage.setItem(sector,index);
        SectorSession[sector] = index;
        index = index + 1;
    }

    function loadSite(lon, lat, infomation, img) {
        siteLPoint.push({
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
            icon: img,
            info: infomation,
            //  wgs84: {lng:lon,lat:lat},
            //bd09:{lng:lon,lat:lat}
        });
    }

    function loadGSMSector(lon, lat, dir, sector, img) {
        sectorGPoint.push({
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
            deg: dir,
            icon: img,
            text: sector,
            net: 2
        });
        //保存小区下标数组
        // sessionStorage.setItem(sector,index);
        // SectorSession[sector] = index;
        // index = index + 1;
    }

    function loadGSMSite(lon, lat, infomation, img) {
        siteGPoint.push({
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
            icon: img,
            info: infomation,
            //  wgs84: {lng:lon,lat:lat},
            //bd09:{lng:lon,lat:lat}
        });
    }

    function showenb(e) {
        if (!e || e.length == 0) {
            $('#map-tip').css('display', 'none');
            return;
        }
        if (basemap.mapvw.getZoom() <= 15)
            return;
        $('#map-tip').html(' ');
        var d = {};
        var c = null;
        var n='';
        $.each(e, function (a, b) {
            if (c == null)
                c = b.geometry._coordinates;
            var p = b.info.split(',');
            $.each(p, function (i, j) {
                var k = j.split('|');
                var s = k[0].substring(0, k[0].indexOf('-'));
                if (!(s in d)) {

                    if(s in site)
                        n=site[s];
                    $('#map-tip').html(s+"("+n+")"+ '\n' + $('#map-tip').html());
                    d[s] = "";
                }
            })
        })
        d = null;
        $('#map-tip').css('left', (c[0] + 10) + 'px')
        $('#map-tip').css('top', (c[1] - 10) + 'px')
        $('#map-tip').css('display', 'block');
    }

    /*
    更新地图
     */
    var updatesectormap = function () {
        loadsectormap();
        $("#map-date-label-id").text("地图 " + basemap.VMapCfg.mapDate);
    }

    /*
    增加右键菜单
     */
    function addMapRightKey(item, e) {
        $(".web-context-menu").empty();
        $(".web-context-menu").empty();
        if (item && item.length > 0) {
            // lyrmgr.clearStyle();
            var vl = [];
            $.each(item, function (i, v) {
                var k = v.info.split(',');
                if (k) {
                    $.each(k, function (j, _v) {
                        var s = _v.split('|');
                        if (s.length > 0) {
                            if ($Layer._cl && (s[0] in $Layer._cl))
                                vl.push(s[0])
                        }
                    });
                }
            })
            if (vl.length > 0) {
                vl.sort();
                //修改菜单
                var rkey = rightkey.addArrayMenu(vl, basemap.VMapCfg.mapType);
                contextMenu.addMenus(rkey, basemap.VMapCfg.mapSelector);//#map
                contextMenu.showMenus(e);
            }
        }
    }

    var GetSectorSession = function () {
        return SectorSession;
    }

    /*
    获取地图小区信息
    items 小区ID列表
     */
    var GetSectorInfo = function (items) {
        var styledata = [];
        if (!SectorSession)
            return styledata;
        var datalyr = lyrmgr.getMapLayerbyType(lyrmgr.LType.SECTORMAP);
        if (datalyr && datalyr.length > 0) {
            $.each(datalyr, function (a, b) {
                var newdata = lyrmgr.getLayer(b.mcode).dataSet._data;
                $.each(items, function (k, i) {
                    var sec = SectorSession[i];
                    if (sec || sec==0) {
                        if (!newdata || sec >= newdata.length)
                            return false;
                        var s = newdata[sec];
                        if (s.text == i) {
                            styledata.push(
                                {
                                    coord: s.geometry.coordinates, sector: s.text, deg: s.deg, mcode: b.mcode, n: s.net
                                }
                            )
                        }
                    }else {

                    }
                })
                if (items.length <= styledata.length)
                    return false;
            })
        }
        return styledata;
    }
    /**
     * @desc 获取所有小区数据
     * @return {{}}
     * @constructor
     */
    var Get = function () {
        var k = {};
        var l = lyrmgr.getMapLayerbyType(lyrmgr.LType.SECTORMAP);
        if (l && l.length > 0) {
            $.each(l, function (i, j) {
                var d = lyrmgr.getLayer(j.mcode).dataSet._data;
                if (d)
                    $.each(d, function (a, b) {
                        k[b.text] = {c: b.geometry.coordinates, s: b.text, d: b.deg, n: b.net}
                    })
            })
        }
        return k;
    }

    var GetZoom = function () {
        return oldsym;
    }
    var SetZoom = function (zoom) {
        oldsym = zoom;
    }

    var ClearSession = function () {
        SectorSession = {};
    }

    /*
    初始化地图窗口
     */
    function initMap() {
        SectorSession = {};
        lyrmgr.clrMapLayer();
        var m = new UCMap.UCLoctions();
        m.clearLayer();
        m.clearLayer(['P', 'U']);
        var L = new Legend();
        L.close()
        //Legend.CloseLegend();
        //  lyrmanager.clrMapLayer();
        $("#sel-info-btn-id").attr("value", "");
        $(".map-property").css("display", "none");
        $(".map-position").css("display", "none");
    }

    /*
    符号变更 小区 基站 样式
     */


    var mapsymbolchanged = function () {
        if (isLoadfirst) {
            return;
        }
        //更新FLAG
        var f = lyrmgr.getMapLayerbyName(stylemap.SName.FLAG);
        if (f) {
            $.each(f, function (a, b) {
                var lyr = lyrmgr.getLayer(b.mcode);
                stylemap.setFlagOverlayStyle(lyr.options.points);
            })
        }

        var current = basemap.mapvw.getZoom();


        if ((current <= 14 && oldsym <= 14) || (current >= 15 && oldsym >= 15))
            return;

        //小区
        var imgsrc = getsectorsymbol(current, 4)
        if (imgsrc) {
            var clayer = lyrmgr.getMapLayerbyName('扇区');
            if (clayer) {
                $.each(clayer, function (i, lyr) {
                    var lyrdata = lyrmgr.getLayer(lyr.mcode);
                    if (lyrdata) {
                        $.each(lyrdata.dataSet._data, function (j, icons) {
                            icons.icon.src = '../../images/map/symbols/sectorv' + imgsrc.isrc;
                        });
                        lyrdata.options.height = imgsrc.height;
                        lyrdata.dataSet.set(lyrdata.dataSet._data);
                        basemap.UpdateMap(lyrdata);
                    }
                });
                clayer.splice(0, clayer.length);
            }
        }
        //gsm
        imgsrc = getsectorsymbol(current, 2)
        if (imgsrc) {
            var clayer = lyrmgr.getMapLayerbyName('GSM扇区');
            if (clayer) {
                $.each(clayer, function (i, lyr) {
                    var lyrdata = lyrmgr.getLayer(lyr.mcode);
                    if (lyrdata) {
                        $.each(lyrdata.dataSet._data, function (j, icons) {
                            icons.icon.src = '../../images/map/symbols/sectorg' + imgsrc.isrc;
                        });
                        lyrdata.options.height = imgsrc.height;
                        lyrdata.dataSet.set(lyrdata.dataSet._data);
                        basemap.UpdateMap(lyrdata);
                    }
                });
                clayer.splice(0, clayer.length);
            }
        }

        //样式
        var styleimg = getstylesymbol(current)
        if (styleimg) {
            var slayer = [];
            var lya = lyrmgr.getMapLayerbyType(lyrmgr.LType.STYLEMAP);
            if (lya != undefined && lya.length > 0) {
                slayer.push(lya)
            }
            lya = lyrmgr.getMapLayerbyName(stylemap.SName.POSITION);
            if (lya) {
                $.each(lya, function (a, b) {
                    slayer.push(b)
                })
            }
            if (slayer) {
                $.each(slayer, function (i, lyr) {
                    var lyrdata = lyrmgr.getLayer(lyr[0].mcode);
                    if (lyrdata) {
                        $.each(lyrdata.dataSet._data, function (j, icons) {
                            var src = icons.icon.src;
                            icons.icon.src = src.replace(styleimg.osrcn, styleimg.nsrcn);
                        });
                        //陈君威修改
                        // lyrdata.options.height = imgsrc.height;
                        lyrdata.dataSet.set(lyrdata.dataSet._data);
                        basemap.UpdateMap(lyrdata);
                    }
                });
                slayer.splice(0, slayer.length);
            }
        }

        //mark
        var p = $Layer.getLayer(['L', 'S', 'W', 'UL']);
        if (p.length > 0) {
            var f = getsectorsymbol(4,current);
            $.each(p, function (a, b) {
                var i = this.getIcon().imageUrl;
                if (i.substring(i.lastIndexOf('/') + 1).indexOf('sector') >= 0) {
                    var k = i.substring(i.lastIndexOf('-') + 1);
                    b.setIcon(new BMap.Icon(i.replace(k, f.isrc), new BMap.Size(f.height == 36 ? 20 : 30, f.height)));
                    b.setRotation(b.getRotation());
                }
            })
        }

         p = $Layer.getLayer(['D']);
        if (p.length > 0) {
            var f = getsectorsymbol(2,current);
            $.each(p, function (a, b) {
                var i = this.getIcon().imageUrl;
                if (i.substring(i.lastIndexOf('/') + 1).indexOf('sector') >= 0) {
                    var k = i.substring(i.lastIndexOf('-') + 1);
                    b.setIcon(new BMap.Icon(i.replace(k, f.isrc), new BMap.Size(f.height == 24 ? 14 : 20, f.height)));
                    b.setRotation(b.getRotation());
                }
            })
        }

        oldsym = current;
    };
    /*
    缩放等级 9-14:0 15-19:1
    symbol 新等级
     */
    var oldsym = 0;

    function getsectorsymbol(net,symbol) {
        var height = 0;
        var src;
        switch (symbol) {
            // case  14:
            case  9:
            case  10:
            case  11:
            case  12:
            case  13:
            case  14:
                src = Getfilename(net,symbol) + '.png';
                height = net == 4 ? 36 : 24;
                break;
            // case  16:
            // case  17:
            // if((oldsym==18&&symbol==17)||(oldsym==15&&symbol==16))//防止16、17频繁切换
            // {
            //     src = '../../images/map/symbols/sectorvm.png';
            //     height=68;
            // }break;
            case  15:
            case  16:
            case  17:
            case  18:
            case  19:
                //case  19:
                src = Getfilename( net,symbol) + '.png';
                height = net == 4 ? 52 : 36;
                break;
        }
        if (src) {
            return {
                isrc: src, height: height
            };
        }
    }

    /*
    样式状态变更
     */
    function getstylesymbol(symbol) {
        var height;
        var osrc;
        var nsrc;
        switch (symbol) {
            // case  14:
            case  9:
            case  10:
            case  11:
            case  12:
            case  13:
            case  14:
                osrc = '-' + Getfilename(4,oldsym) + '-';
                nsrc = '-' + Getfilename(4) + '-';
                height = 36;
                break;
            // case  16:
            // case  17:
            // if(oldsym==15&&symbol==16)//防止16、17频繁切换
            // {
            // 	osrc='-1-';
            //     nsrc = '-2-';
            //     height=68;
            // }
            // else if(oldsym==18&&symbol==17)
            // {
            // 	osrc='-3-';
            //     nsrc = '-2-';
            //     height=68;
            // }
            // break;
            case  15:
            case  16:
            case  17:
            case  18:
            case  19:
                //case  19:
                osrc = '-' + Getfilename(4,oldsym) + '-';
                nsrc = '-' + Getfilename(4) + '-';
                height = 52;
                break;
        }
        if (nsrc) {
            return {
                osrcn: osrc, nsrcn: nsrc, height: height
            };
        }
    }

    exports.LoadSectorMap = loadsectormap;
    exports.LoadSectorMapPoi = loadsectormappoi;
    exports.UpdateSectorMap = updatesectormap;
    exports.mapSymbolchanged = mapsymbolchanged;
    exports.getZoom = GetZoom;
    exports.setZoom = SetZoom;
    exports.getSectorSession = GetSectorSession;
    exports.clearSession = ClearSession;
    exports.getfilename = Getfilename;
    exports.getSectorInfo = GetSectorInfo;
    exports.get = Get;
    Object.defineProperty(exports, '__esModule', {value: true});
})));

