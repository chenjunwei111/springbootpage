'use strict';
(function (window) {
    window.basemap=window.basemap?window.basemap:{};
    //通用地图
    basemap.mapvw;
    //通过地图信息
    basemap.VMapCfg={};
    //地图功能类型 对应右键菜单
    basemap.MapType={
        normal:0,
        dyoverlay:1,
        updownmatrix:2,
        uplinterfence:3,
        handoveropt:4,
        weakgrid:5,
        overconvergrid:6,
        aoagrid:7,
        aoaazi:8,
        competitorgrid:9,
        mdt:10,
        mdtquyu:101,
        atu:11,
        atuear:12,
        atuway:13,
        mrogrid:14,
        mdtanaly:15,
        buildingheat:16
    }

    /*
    [bussBox] bussBox={callback:,url:,text:,[subbox]} subbox={callback:,url:,text:}
    增加业务BOX
    */
    basemap.addbussBox=function(bussbox,selector) {
        if (!bussbox)
            return;
        // selectorid = "#" + selectorid;
        var selectid = $(selector);
        if (!selectid || selectid.length == 0)
            return;
        $(selector + '.mtool-box').remove();
        $.each(bussbox, function (a, b) {
            $(selector).append(
                "<div class=\"mtool-box\" id='"+Math.random().toString(8).replace(".", "")+"' enabled='"+(b.enabled?b.enabled:false)+"' unselected='"+(b.unselected?b.unselected:false)+"'><i></i>\n" +
                "<ul class=\"mtool-nav\" >\n" +
                "    <li class=\"mtool-nav-item\" >\n" +
                "        <div  class=\"mtool-header mh"+ a+"\">\n" +
                "            <a href=\"javascript:;\"></a>\n" +
                "        </div>\n" +
                "        <dl class=\"mtool-nav-child  mtool-hide\" statue='0'>\n" +
                "        </dl>\n" +
                "    </li>\n" +
                "</ul>\n" +
                "</div>"
            );
            // if (b.url) {
            //     $(selector + ' .mtool-header :last').prepend("<img src='" + b.url + "' class=\"mtool-nav-img\">")
            // }
            if (b.url) {
                $(selector + ' .mtool-header a:last').append("<img src='" + b.url + "' class=\"mtool-nav-img\">")
            }
            $(selector + ' .mtool-header a:last').text(b.text);
            if (b.callback && typeof b.callback == "function") {
                $(selector + ' .mtool-box:last').on('click', function (e) {
                    basemap.setBoxStatue(e,1);
                    b.callback(e);
                });
                $(selector + ' .mtool-box:last').css('cursor', 'pointer')
                $(selector + ' .mtool-box a:last').css('cursor', 'pointer')
            }
            if (b.title) {
                commdiv.$addMoveTip(b.title, selector + ' .mh'+a, 1);
            }
            if (b.mbLayer && b.mbLayer.length > 0) {
                $(selector + ' .mtool-box:last').attr('enabled','true')
                $(selector + ' .mtool-box:last').hover(function (e) {
                    var E = e.currentTarget.querySelector('.mtool-nav-child');
                    if (E) {
                        E.setAttribute('class', 'mtool-nav-child  mtool-show');
                        E.setAttribute('statue', '1');
                    }
                }, function (e) {
                    var a = e.currentTarget.querySelector('.mtool-nav-child');
                    a.setAttribute('statue', '0');
                    var k = setInterval(function () {
                        if (a) {
                            if (a.getAttribute('statue') == '0') {
                                a.setAttribute('class', 'mtool-nav-child  mtool-hide');
                                clearInterval(k);
                            }
                        }
                    }, 800)
                });
                $(selector + ' .mtool-nav-child:last').hover(function (e) {
                    e.currentTarget.setAttribute('statue', '1');
                }, function (e) {
                    e.currentTarget.setAttribute('statue', '0');
                });
                $.each(b.mbLayer, function (c, d) {
                    $(selector + ' .mtool-nav-item dl:last').append(
                        "<dd  class=\"md"+ c+"\" id='"+Math.random().toString(8).replace(".", "")+"' enabled='"+(d.enabled?d.enabled:false)+"' unselected='"+(d.unselected?d.unselected:false)+"'><i></i>" + (d.url ? "<img src='" + d.url + "'/>" : "") + "<a href=\"javascript:;\"><i>&nbsp; </i>" + d.text + "</a></dd>")
                    if (d.callback && typeof d.callback == "function") {
                        $(selector + ' .mtool-nav-item dd:last').on('click',
                            function (e) {
                                basemap.setBoxStatue(e,1);
                                d.callback(e)
                            }
                        );
                    }
                    if (d.title) {
                        commdiv.$addMoveTip(d.title, selector + ' .md'+c, 2);
                    }
                });
            }
            ;
        })
    }
    
     basemap.setBoxStatue=function(e,f) {
        if (e) {
            if(f==1) {
                var a = e.currentTarget.id;
                var b = $(e.currentTarget).closest('.map-tools');
                if (b.length==0) {
                    b = $(e.currentTarget).closest('.mbussLayer');
                    var m=new UCMap.UCLoctions();
                    m.clearLayer();
                }
                var i=0;
                //$('.mbussLayer .map-tools .mtool-box').removeClass('mtool-disabled');
                var k=$('.mbussLayer  dd');
                for(;i<k.length;i++)
                {
                    $('#'+k[i].id).removeClass('mtool-disabled');
                }
                i=0;
                k=$('.mbussLayer i');
                for(;i<k.length;i++)
                {
                    $(k[i]).removeAttr('class')
                }
                // $('.mbussLayer  dd').removeClass('mtool-disabled');
                setBoxOpen(a, b);
            }
            else if(f==0) {
                setBoxClose();
            }
        }
    }

    function setBoxOpen(i,m) {
        if (m) {
            $('.' + m[0].className + ' i').removeAttr('class');
            $('.' + m[0].className + ' .mtool-box').addClass('mtool-disabled');
            $('.' + m[0].className + ' dd').addClass('mtool-disabled');

            var p = $("#" + i).attr("enabled");
            var e = $("#" + i).attr("unselected");
            if (p == 'true' && e == 'true') {
                $('.' + m[0].className + ' .mtool-box').removeClass('mtool-disabled');
                $('.' + m[0].className + ' dd').removeClass('mtool-disabled');
                return;
            }
            if (p == 'true') {
                $('#' + i).removeClass('mtool-disabled');
            }
            if (e == 'false') {
                if ($("#" + i)[0].className.indexOf('mtool-box')>=0)
                    $('#' + i + ' i:first').addClass('seleted seleted-box');
                else
                    $('#' + i + ' i:first').addClass('seleted seleted-child');
            }

            if( $('#' + i).is('dd')) {
                var a=$('#' + i).closest('.mtool-box')[0].id;
                $('#'+a).removeClass('mtool-disabled');
                $('#'+a+' dd:not(#'+i+')').removeClass('mtool-disabled');
            }
        }
    }
    function setBoxClose() {
        $('.map-tools i').removeAttr('class');
        $('.map-tools .mtool-box').removeClass('mtool-disabled');
        $('.map-tools  dd').removeClass('mtool-disabled');
    }
    /*
    初始化Map图层
    mapselector:装载Map的容器
     */
    basemap.InitMapLayer=function () {
        var mapselector=basemap.VMapCfg.mapSelector;
        basemap.VMapCfg.mapID=Math.random().toString(16).replace(".","");
        //地图底图
        var h=$("#"+basemap.VMapCfg.mapSelector).html();
        $("#"+basemap.VMapCfg.mapSelector).html("<div class=\"basemap\" id=\""+basemap.VMapCfg.mapID+"\"></div>\n"+
            //工具栏
            "<div class=\"map-tools\">\n" +
            "</div>\n"+
            //状态栏
            "<div class=\"map-status\">\n" +
            "<span>\n" +
            "<div class=\"lon-lat-label\" id=\"lon-lat-label-id\">0.000000  0.000000</div>\n" +
            " <div class=\"vertical-line\"></div>\n" +
            " <div class=\"zoom-class-label\" id=\"zoom-class-label-id\">等级  </div>\n" +
            "<div class=\"vertical-line\"></div>\n" +
            "<input class=\"sel-info-btn\" id=\"sel-info-btn-id\" type=\"button\"  value=\"\"></input>\n" +
            " <div class=\"vertical-line\" ></div>\n" +
            "<div class=\"map-loading\" id=\"map-loading-id\" style='display: none'><i></i><span></span></div>\n" +
            "<div class=\"map-date-label\" id=\"map-date-label-id\"> </div>\n" +
            "</span>\n" +
            " </div>\n"+
            //定位DIV
            "<div class=\"map-position\" id=\"map-position-id\" style='left: 35%;background: #16354F;color: #ffffff;'>\n" +
            "<H4><label class=\"p-label\" id=\"p-label-id\" style=\"height: 20px;margin-left:5px;font-size: 14px;margin-top: 6px;font-weight: 100;\">小区定位</label></H4>\n" +
            "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" onclick=\"maptool.position_close(this)\"></input>\n" +
            " <div class=\"line-split\"  style='margin-top: -5px;'> </div>\n" +
            "<div class=\"p-content\">\n" +
            "<label class=\"p-content-label\" style='font-size: 13px;'>ID </label>\n" +
            "<input class=\"p-content-text layui-input\" style='display: initial;height: 34px;' focusplaceholder=\"输入小区ID\" type=\"text\" value=\"\" />\n" +
            "</div>\n" +
            "<div class=\"p-content\" style=\"margin-top:5px;margin-bottom: 5px;\">\n" +
            "<input class=\"p-content-ok\"  type=\"button\"  style='margin-top: 5px;' onclick=\"maptool.findMapInfo()\" value=\"定位\"></input>\n" +
            "</div>\n" +
            "</div>\n"+h
        );
        $("#"+basemap.VMapCfg.mapSelector).append( "<div class=\"map-address-poi\" id=\"map-address-poi-id\">\n" +
            "<h4 style='text-align: left'><label  style=\"height: 28px;font-size: 18px;padding: 10px;\">地址查询</label></h4>\n" +
            "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" onclick=\"maptool.addresspoi_close(this)\" ></input>\n" +
            "<div class=\"line-split\" style='margin-top: 5px;'> </div>\n" +
            "<div class=\"layui-table-view\" id=\"set-address-poi-id\" ></div>\n" +
            "</div>\n");
          $('#'+basemap.VMapCfg.mapSelector).append("<div id='map-tip' style=' position: absolute;\n" +
              "display: none;\n" +
              "box-shadow:  #0a4554 0px 0px 10px;\n" +
              "border: 1px solid #1e4f6b;\n" +
              "background: #1e4f6b;\n" +
              "word-wrap:break-word;\n" +
              "padding: 5px;\n" +
              "color: white;'></div>")
             $('#'+basemap.VMapCfg.mapSelector).append("<div id='map-property' style=' position: absolute;display: none;top: 15%;left: 30%;'>" +
            "<H4 id='my-drag' style='background: rgb(21,38,61); height: 29px;text-align: left;font-size: 18px;font-weight: bold;padding-top: 5px;color: white;'>小区属性</H4>" +
            "<span id='close-property' style='position: absolute;width: 6px;height: 6px;float: left;top: -1px;color: white;right: 4px;'>x</span>" +
            "<div id='property-table'></div></div>")
            //工具栏
            basemap.addbussBox([
                {
                    url:"../../images/map/tools/querymap.png",
                    mbLayer:[
                        {
                            url: "../../images/map/tools/cell-pos.png",
                            callback: function (e) {
                                maptool.position_open(0, e);
                            },
                            text:'小区查询'
                        },
                        {
                            url: "../../images/map/tools/lnglat-pos.png",
                            callback: function (e) {
                                maptool.position_open(2,e);
                            },
                            text:'经纬度定位'
                        },
                        {
                            url: "../../images/map/tools/adress-pos.png",
                            callback: function (e) {
                                maptool.position_open(3, e);
                            },
                            text:'地址解析'
                        }
                        ],
                    title:'地图搜索'
                },
                {
                    url: "../../images/map/tools/zoom-out.png",
                    callback: function (e) {
                        maptool.zoomout(e);
                    },
                    title:'放大地图',
                    enabled:true,
                    unselected:true
                },
                {
                    url: "../../images/map/tools/zoom-in.png",
                    callback: function (e) {
                        maptool.zoomin(e);
                    },
                    title:'缩放地图',
                    enabled:true,
                    unselected:true
                },
                {
                    url: "../../images/map/tools/rec-zoomout.png",
                    callback: function (e) {
                        maptool.rec_zoomout(e,-1);
                    },
                    title:'拉框放大',
                    enabled:true
                },
                {
                    url: "../../images/map/tools/rec-zoomin.png",
                    callback: function (e) {
                        maptool.rec_zoomout(e,1);
                    },
                    title:'拉框缩小', enabled:true
                },
                {
                    url: "../../images/map/tools/measure.png",
                    callback: function (e) {
                        maptool.measure_open(e);
                    },
                    title:'测量距离', enabled:true
                },
                {
                    url: "../../images/map/tools/clearlayer.png",
                    callback: function (e) {
                         var  m=new UCMap.UCLoctions();
                         m.clearLayer();
                    },
                    title:'清除样式',
                    enabled:true,
                    unselected:true
                },
                // {
                //     url: "../../images/map/tools/layer-manager.png",
                //     callback: function (e) {
                //         maptool.ShowLayerMgr(e);
                //     },
                //     title:'图层管理'
                // },
            ],'.map-tools');
            $('.map-tools .mtool-box').css('width','28px');

            //增加业务图层
            setbussLayer();

            //图例
        var l=new Legend();
        l.init(basemap.VMapCfg.mapSelector);

        // commdiv.$setDragDiv("map-position-id");
        // commdiv.$setDragDiv("map-layermgr-id");
        // commdiv.$setDragDiv('map-property-id');

        commdiv.$addMoveTip('小区定位','#cell-pos-id',3);
        commdiv.$addMoveTip('经纬度定位','#lnglat-pos-id',3);
        commdiv.$addMoveTip('地址查询','#adress-pos-id',3);
        commdiv.$addMoveTip('测距','#measure-id',3);
        commdiv.$addMoveTip('拉框放大','#rec-zoomout-id',3);
        commdiv.$addMoveTip('清除样式','#clearlayer-id',3);
        commdiv.$addMoveTip('图层管理','#layer-manager-id',3);
        commdiv.$addMoveTip('放大一级','#zoom-out-id',3);
        commdiv.$addMoveTip('缩小一级','#zoom-in-id',3);
    };

    /*
    MInfos:{mapName:text,mapCity:city,cityCode:citycode,mapDate:date,mapSelector:mapsel,mapType:maptype}
    MapType: basemap.MapType
    mapSelector:装载地图容器类ID
    mCallBack:默认打开返回函数
    mClick:点击地图函数
    mbLayer:业务图层 [{text:,url:,title:,callback:,mbLayer:[{text:,url:,title:,callback:}]}]
     */
    basemap.SetMapViewer=function (m) {
        //不能连接地图 出现'BMap' is undefined 错误
        if (!m || !m.mSelector || !m.mCity || !m.mDate || !m.mCityCode)
        {tips("地图数据错误.");return -1;}
        if ($('#' + m.mSelector).length == 0) {
            return -1;
        }
        if (m.mDate != basemap.VMapCfg.mapDate&&basemap.mapvw!=null) {
            basemap.setMapInfo(m);
            setbussLayer();
            sectormap.UpdateSectorMap();
            return;
        }
        //防止重复加载小区
        if ( basemap.VMapCfg.mapDate&&
            m.mDate === basemap.VMapCfg.mapDate) {
            basemap.callBack();
            return;
        }

        basemap.tilesOver=false;
        basemap.setMapInfo(m);
        basemap.InitMapLayer();
        basemap.mapvw=null;
        try {

            basemap.mapvw = new SPMap.Map(basemap.VMapCfg.mapID);
        }
        catch (e) {
            tips("获取地图服务失败!")
            return -1;
        }
        // maps.setMinZoom(9);
        // maps.setMaxZoom(19);
        basemap.mapvw.enableScrollWheelZoom();// disableScrollWheelZoom()// 开启鼠标滚轮缩放
        basemap.mapvw.disableDoubleClickZoom();
        basemap.mapvw.enableKeyboard();
        basemap.mapvw.setMapStyle({style:'bluish'})
        basemap.mapvw.setDefaultCursor('auto');
        // basemap.mapvw.setDraggingCursor('hand');
        // var mc=mapv.utilCityCenter.getCenterByCityName(m.mCity);
        if(!m.mCity)
        {
           // tips("无法定位地市.")
            m.mCity='昆明';
        }
        basemap.mapvw.centerAndZoom(m.mCity, 17); // 初始化地图,设置中心点坐标和地图级别 //new BMap.Point(102.486972, 24.894613)
        basemap.mapvw.disableContinuousZoom();
        basemap.mapvw.addEventListener("tilesloaded", loadMap);
        var lonlat = document.querySelector(".lon-lat-label");
        basemap.mapvw.addEventListener("mousemove", function (e) {
            var wgs=coordtransform.bd09towgs84( e.point.lng,e.point.lat)
            //lonlat.innerText = e.point.lng + '° ' + e.point.lat + '°';
            lonlat.innerText = wgs.lng.toFixed(6) + '° ' +wgs.lat.toFixed(6) + '°'
        });

        basemap.mapvw.addEventListener("zoomend", function (type) {
            var symbol = basemap.mapvw.getZoom();
            var c=new MapCutter();
            c.set(symbol);
            sectormap.mapSymbolchanged();
            $(".zoom-class-label").text("等级 " + symbol);
        });

        if(m.mClick!= undefined&&typeof  m.mClick==='function') {
            basemap.mapvw.addEventListener("click", function (e) {
                m.mClick(e);
            });
        }

        //全景图
//		 var stCtrl = new BMap.PanoramaControl();
//		stCtrl.setOffset(new BMap.Size(20, 500));
//		map.addControl(stCtrl);

        //初始化信息
        $("#sel-info-btn-id").attr("value", "");
    };

    basemap.AddTileEvent=function () {
        basemap.mapvw.removeEventListener("dragend",this);
        basemap.mapvw.addEventListener('dragend',function () {
            var tiles = new MapCutter();
            tiles.set(basemap.mapvw.getZoom());
        });
    }

    basemap.UpdateMap= function (layer) {
        // layer.canvasLayer.options.update();
        var a=setTimeout(function () {
            layer.map.panBy(1,0);
            clearTimeout(a);
        },50);
    }

    basemap.setMapInfo=function (_MapInfos) {
        basemap.VMapCfg.mapCityCode = _MapInfos.mCityCode;
        basemap.VMapCfg.mapCity = _MapInfos.mCity;
        basemap.VMapCfg.mapDate = _MapInfos.mDate;
        basemap.VMapCfg.mapSelector = _MapInfos.mSelector;
        basemap.VMapCfg.mapType=_MapInfos.mType;
        basemap.VMapCfg.mapCallBack=_MapInfos.mCallBack;
        basemap.VMapCfg.mapBussLayer= _MapInfos.mBussLayer;
        basemap.VMapCfg.mapClick=_MapInfos.mClick;
        basemap.VMapCfg.mapGDate=_MapInfos.mapgDate;
    }

    function  setbussLayer() {
        if(basemap.VMapCfg.mapBussLayer&&basemap.VMapCfg.mapBussLayer.length>0) {
            // $("#" + basemap.VMapCfg.mapSelector).append("<div id='blayer' style='position:absolute;height:28px;top:0px;margin-left:" + ($('.map-tools')[0].offsetWidth+5) + "px'> </div>");
            $("#" + basemap.VMapCfg.mapSelector+' #blayer').remove();
            $("#" + basemap.VMapCfg.mapSelector).append("<div class='mbussLayer' id='blayer'> </div>");
            basemap.addbussBox(basemap.VMapCfg.mapBussLayer, '#blayer');
        }
    }
    function loadMap() {
        basemap.mapvw.removeEventListener("tilesloaded", loadMap);
        var ScaleControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        basemap.mapvw.addControl(ScaleControl);
        ScaleControl.setOffset(new BMap.Size(15, $("#" + basemap.VMapCfg.mapID).get(0).offsetHeight - 50));//280
        $('.BMap_scaleTxt').css("color", "red");

        basemap.tilesOver=true;
        // sectormap.setZoom(17);
        // sectormap.LoadSectorMap();
    }

    basemap.callBack= function () {
        var t=setInterval(function () {
            var d=lyrmgr.getMapLayerbyName('扇区')
            if(d&&d.length>0)
            {
                if (basemap.VMapCfg.mapCallBack != undefined &&
                    typeof basemap.VMapCfg.mapCallBack == "function" && basemap.mapvw != null) {
                    basemap.VMapCfg.mapCallBack();
                }
            }
            clearInterval(t);
        },500)
    }
})(window);


