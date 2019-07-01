'use strict';

// department表地市对应



// 用户地址检索定位
var $param={};
var redPlaceIdConnection = [];
var placeIdConnection = [];
var UCMap=window.UCMap=UCMap||{};
var u=UCMap.UCLoctions=function () {
    this._parameters = {};
    this._data = [];
};

// 按业务分图层 XX L:线 P:点 M:mark S:面 T:切片 X同一业务图层名
u.prototype.ln= {
    CELL:'SC',// 小区
    SITE:'SE',// 基站
    UCL:'U',// 投诉点
    LOCATION:'L',// 小区定位
    POSITION:'P',// 问题小区
    USERTRACK:'T',// 用户轨迹
    WARNING:'W',// 告警
    GRID:'G',// 栅格
    SELCELL:'S',// 多小区选择
    UPLINK:'I',// 上行干扰
    BUSSCLS:'B',// 不同业务类型
    FLAG:'F'// 标识
}
/**
 * @description 设置参数
 * @param {Object}
 *            mapPara:{mcity,mcitycode,mdate,mselector}
 * @param {Object}
 *            xdrPara http/cover/talk
 * @param {Object}
 *            uclPara sno
 * @param {String}
 *            bs base/buss
 */
u.prototype.setparameters =function (mapPara,bs) {
	
    $param = {}
    // var setMap= function () {
    $param._my = mapPara.mcity;
    $param._me = mapPara.mcitycode;
    $param._md = mapPara.mdate || '20180416';
    $param._ms = mapPara.mselector;
    $param._gd = mapPara.gsmdate;
    if(mapPara.point){
        sectormap.ucpoint=mapPara.point;
    }
    // }.call(this)
    if (mapPara.imsi && mapPara.type && mapPara.xdate) {
        $param._mi = mapPara.imsi;
        $param._tp = mapPara.type;
        $param._xd = mapPara.xdate;//
    }
    if (mapPara.sno)
        $param._sn = mapPara.sno;
    if (bs)
        $param._bs = bs;
};




/**
 * @description 设置数据
 * @param {Array}
 *            data
 * @param {String}
 *            [datatype]
 */
u.prototype.set=function(data,datatype) {
    if (!data) {
        return;
    };
    $param._x={};
    if($param._bs=='base')
    {
        $param._x = [];
        if(datatype=='cover')
        {
            $.each(data, function (a, b) {
                if ( b.LONGITUDE && b.LATITUDE && b.XDR_ID ) {
                    var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
                    $param._x.push({
                        cr: c,
                        xd: b.XDR_ID,
                        ct:b.EVENT&&b.EVENT=='乒乓X2切换'&&b.EVENT_DETAIL?b.EVENT_DETAIL:undefined
                    })
                    if (!$param._c&&b.CELL_ID) {
                        $param._c = b.CELL_ID;
                    }
                }
            })
        }

      else if(datatype=='http')
        {
            $param._h=[];
            $.each(data, function (a, b) {
                if ( b.LONGITUDE && b.LATITUDE) {
                    var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
                    $param._h.push({
                        cr: c,
                        xd: b.XDR_ID,
                        et:b.EVENT,
                        // hd:b.HOUR_ID
                    })
                }
            })
        }
    }
    else if($param._bs=='buss'){
        if(datatype=="ul")
        {
            $param._x._u={};
            var _data=data.list;
            if(_data) {
                $.each(_data, function (a, b) {
                    $param._x._u[b.SECTOR_ID] = b.INTERSTRONG;
                })
            }
        }
        else if(datatype=="wn") {
            $param._x._w = {};
            var _data=data.list;
            if(_data) {
                $.each(_data, function (a, b) {
                    if (b.SECTOR_ID in $param._x._w) {
                        $param._x._w[b.SECTOR_ID] = {
                            c: b.EQUIPMENT_ALARM.indexOf('性能告警')>0?8:9,
                            t: $param._x._w[b.SECTOR_ID].t + ';' + b.HAPPEN_TIME + ' ' + b.ERROR_TYPE
                        }
                    }
                    else {
                        $param._x._w[b.SECTOR_ID] = {c: b.EQUIPMENT_ALARM.indexOf('性能告警')>0?8:9, t: b.HAPPEN_TIME + ' ' + b.ERROR_TYPE}
                    }
                })
            }
        }
        else if(datatype=="gw") {
            $param._x._gw = {};
            var _data=data.list;
            if(_data) {
                $.each(_data, function (a, b) {
                    if (b.SECTOR_ID in $param._x._gw) {
                        $param._x._gw[b.SECTOR_ID] = {
                            c: b.EQUIPMENT_ALARM.indexOf('性能告警')>0?8:9,
                            t: $param._x._gw[b.SECTOR_ID].t + ';' + b.HAPPEN_TIME + ' ' + b.ERROR_TYPE
                        }
                    }
                    else {
                        $param._x._gw[b.SECTOR_ID] = {c: b.EQUIPMENT_ALARM.indexOf('性能告警')>0?8:9, t: b.HAPPEN_TIME + ' ' + b.ERROR_TYPE}
                    }
                })
            }
        }
    }
}

u.prototype.map = function () {
	
    if (!$param) {
        throw new Error('No Parameters!');
        return;
    }

    if (!$param._my || !$param._me || !$param._md || !$param._ms) {
    throw  new Error('Map Parameter invalid!');
        return;
    }

    // if (!$param._sn) {
    // throw new Error('Ucl Parameter invalid!');
    // return;
    // }
   var k= setTimeout(function (_this) {
        basemap.SetMapViewer({
            mCity: $param._my,
            mCityCode: $param._me,// 530100_20170905
            mDate: $param._md,// date.replace(/-/g, ""),
            mSelector: $param._ms,// ID
            mBussLayer: getBusiness(_this),
            mapgDate:$param._gd,
            mCallBack: function () {
                $param.mc=true;
                $param.lc = false;
                $Evt.loading.off();
            }
        });

        clearTimeout(k);
    }, 500,this)
    // var k = setInterval(function (_callback) {
    // if (_ok == true) {
    // _ok = false;
    // if (typeof _callback === 'function') {
    // _callback();
    // }
    // clearInterval(k);
    // }
    // }, 500, callback)
}

u.prototype.update= {
    cell: function (date,city) {
    	
        $param.mc = false;
        wait.u(function () {
            $Evt.loading.on('加载小区图层...',30);
            if (date) {
                basemap.VMapCfg.mapDate = date;
                $param._md = date;
            }
            if(city)
                basemap.VMapCfg.mapCityCode = city;
            // $param.lc = true;
            sectormap.UpdateSectorMap();
        })
    },
    xdr: function (x) {
        var l = $Layer.getLayer('LS');
        if (l.length > 0) {
            l[0].setStrokeColor("red");
        }
        var m = $Layer.getLayer('P', x);
        if (m.length > 0) {
            var _m = m[0];
            _m.setIcon(new BMap.Icon("../../images/map/symbols/mark_xdr_sel.png", new BMap.Size(32, 42)));
            _m.setTop(true);
            _m.setAnimation(BMAP_ANIMATION_BOUNCE);
            var k = setTimeout(function () {
                _m.setAnimation(null);
                clearTimeout(k);
            }, 3000)
            basemap.mapvw.panTo(_m.getPosition());
        }
    },
    ucl: function (s) {
    	
        wait.m(function () {
            $Layer.clearLayer('U');
            if (s)
                $param._sn = s;
            startucl();
        })
    },
    xdrs: function (s) {
        if (!$param._x)
            return;
        if (s) {
            $param._c = s;
        }

        wait.m(function () {
             // $Evt.loading.on('加载中...',2)
            // console.log("kkk-2");
            $Layer.clearLayer(['S', 'P', 'XLX', 'W']);
            startxdr();
            $('#sel-info-btn-id').attr("value", s);
            console.log("kkk-3");
           // $Evt.loading.off();
           // console.log("kkk-4");
        })
    },
    cellline:function () {
        $Layer.clearLayer('R');
        if (!$param._x || !$param._c)
            return;
        wait.c(function () {
            var cell = [];
            console.log($param._x);
            $.each($param._x, function (a, b) {
                if (b.ct&&b.ct.indexOf('到') > 0) {
                    var c = b.ct.substring(b.ct.indexOf('到') + 1).trim();
                    if (c!='') {
                        cell.push(c);
                    }
                }
            })
            $Layer.drawCellLine(cell);
        })
    },
    cells: function (date,city) {
    	
        $param.mc = false;
        wait.m(function () {
            $Evt.loading.on('加载小区图层...',30);
            if (date) {
                basemap.VMapCfg.mapDate = date;
                $param._md = date;
            }
            if(city)
                basemap.VMapCfg.mapCityCode = city;

            sectormap.UpdateSectorMap();
        })},
}

u.prototype.drawLayer = {
    drawWarning: function (d) {
        $Layer.drawWarningLayer(d);
    },
    drawMrGrid: function () {
        $Layer.drawMrRsrpGird();
    },
    drawUclPoint:function () {
        $Layer.drawAroundUserPoint();
    },
    drawDiffBuss:function () {
        $Layer.drawDiffBussLayer();
    },
    drawUplink:function () {
        $Layer.drawUplinkLevel();
    },
    /**
	 * @desc 画小区
	 * @param {String|Array}
	 *            s
	 * @param {Boolen}
	 *            [def]
	 */
    drawSector:function (s,def) {
    	
        wait.c(function () {
            $Layer.clearLayer('X');
            if (def == true) {
                $Layer.clearLayer('L');
                $Layer.drawSectorLayer(s, 16, 'L');
                // 临时GSM告警 上传代码要注释
                // $Layer.drawGSMWarningLayerTemp();
            }
            else {
                $Layer.clearLayer('S');
                $Layer.drawSectorLayer(s, 4, 'S', true);
                $('#sel-info-btn-id').attr("value",s);


            }
        })
    },
    
    drawNbSector:function (s,def) {
        //
        wait.c(function () {
            $Layer.clearLayer('X');
            if (def == true) {
                $Layer.clearLayer('L');
                //
                $Layer.drawNbSectorLayer(s, 16, 'L');
                // 临时GSM告警 上传代码要注释
                // $Layer.drawGSMWarningLayerTemp();
            }
            else {
                $Layer.clearLayer('S');
                //
                $Layer.drawNbSectorLayer(s, 4, 'S', true);
                $('#sel-info-btn-id').attr("value",s);


            }
        })
    },
    drawSectorLine:function (s,lng,lat,def) {
        //
        wait.c(function () {
            $Layer.clearLayer('X');
            if (def == true) {
                $Layer.clearLayer('L');
                //
                $Layer.drawSectorLineLayer(s,lng,lat, 16, 'L');
                // 临时GSM告警 上传代码要注释
                // $Layer.drawGSMWarningLayerTemp();
            }
            else {
                $Layer.clearLayer('S');
                $Layer.drawSectorLineLayer(s,lng,lat, 4, 'S', true);
                $('#sel-info-btn-id').attr("value",s);


            }
        })
    },
    

    /*
	 * 设置范围值样式 sectors key-小区 value-值
	 */
    drawSectorS:function (sectors) {
    	
        wait.c(function () {
        stylemap.setRangeSectorStyle(sectors,stylemap.SName.SECTOR_COLOR,"预警级别");
        })
    },
    drowSector2:function (point) {
     var point = coordtransform.wgs84tobd09(sectorPoint.lng, sectorPoint.lat);
     $Layer.panToFlag({lng: point.lng, lat: point.lat}, {map: basemap.mapvw});
    },
    drawMarks:function (sectorPoint,marks) {
        $Layer.clearLayer(['UXX']);
        wait.c(function () {
            if(sectorPoint!=null){
                var point2 = coordtransform.wgs84tobd09(sectorPoint.lng, sectorPoint.lat);
                $Layer.panToFlag({lng: point2.lng, lat: point2.lat}, {map: basemap.mapvw});
            }
            for(var i=0;i<marks.length;i++){
                var point = coordtransform.wgs84tobd09(marks[i].LNG, marks[i].LAT);
                var t = new BMap.Point(point.lng, point.lat);
                var n = new BMap.Icon("../../images/map/symbols/mark_ucl_new.png", new BMap.Size(20, 23));
                var k = new BMap.Marker(t,
                    {
                        icon: n,
                        offset: {width: 0, height: -12},
                        enableMassClear: false,
                        // title: marks[i].UE_ADDRESS,//地址
                        enableClicking: false,
                        // mcode: 'UXX',
                    });
                k._XF = 'UXX';
                basemap.mapvw.addOverlay(k);
                var l=new Legend();
                l.add({m:{f:'../../images/map/symbols/mark_ucl_new.png',t:'投诉点'},k:'UXX'})
            }
        })
    },
    // 清除地址覆盖物
    clearAreakMark:function(){
    	 for( var i in redPlaceIdConnection){
         	basemap.mapvw.removeOverlay(redPlaceIdConnection[i]); 
   	  	 } 
   	  	 redPlaceIdConnection = [];
   	  	 
   	  	 for( var i in placeIdConnection){
   	  		 basemap.mapvw.removeOverlay(placeIdConnection[i]); 
 	  	 } 
 	  	 placeIdConnection = [];
    },
    // 【我的区县--周边历史投诉】双击行
    drawClickRowMarks:function (sectorPoint,marks) {
    	var _this = this;
        wait.c(function () {
        	if(sectorPoint!=null){
                var point2 = coordtransform.wgs84tobd09(sectorPoint.lng, sectorPoint.lat);
                basemap.mapvw.panTo(new BMap.Point(point2.lng,point2.lat));
            }
             // 清楚红色覆盖物
             for( var i in redPlaceIdConnection){
            	basemap.mapvw.removeOverlay(redPlaceIdConnection[i]); 
      	  	 } 
      	  	 redPlaceIdConnection = [];
      	  	 var point = coordtransform.wgs84tobd09(marks.UE_X, marks.UE_Y);
             var t = new BMap.Point(point.lng, point.lat);
			  var n = new BMap.Icon("../../images/map/symbols/redPlace.png", new BMap.Size(20, 24));
              var marker= new BMap.Marker(t,
            		  {
                  icon: n/*
							 * , offset: {width: 0, height: -12},
							 * enableMassClear: false, // title:
							 * marks[i].UE_ADDRESS,//地址 enableClicking: false,
							 */
                  // mcode: 'UXX',
                    });
			  
			  // 创建标注
			  marker.setZIndex(100); // 设置覆盖物的zIndex,值越大越至顶
			  basemap.mapvw.addOverlay(marker);
			  redPlaceIdConnection[0] = marker;
			  var content = "<p style='font-size:12px;'>投诉类型: " + marks.BUSINESSTYPE +"</p><p style='font-size:12px;'>距离: "+ marks.NUM+"米</p>";
              _this.addClickHandler(content,marker);
            
        });
    },
    
    drawAreaHisMarks:function (sectorPoint,marks) {
        $Layer.clearLayer(['UXXHIS']);
        $Layer.clearLayer(['UXXHIS1']);
        var _this = this;
        wait.c(function () {
        	if(sectorPoint!=null){
                var point2 = coordtransform.wgs84tobd09(sectorPoint.lng, sectorPoint.lat);
                basemap.mapvw.panTo(new BMap.Point(point2.lng,point2.lat));
            }
        	var has=false;
           for(var i=0;i<marks.length;i++){
                var point = coordtransform.wgs84tobd09(marks[i].UE_X, marks[i].UE_Y);
                var t = new BMap.Point(point.lng, point.lat);
                var url = "../../images/map/symbols/bluePlace.png";
                if(marks[i].ORDERNUM == ""){
                	url = "../../images/map/symbols/mark_ucl_new.png";
                }
                else
                	{
                	has=true;
                	}
                var n = new BMap.Icon(url, new BMap.Size(20, 24));
                var k = new BMap.Marker(t,
                    {
                        icon: n/*
								 * , offset: {width: 0, height: -12},
								 * enableMassClear: false, // title:
								 * marks[i].UE_ADDRESS,//地址 enableClicking:
								 * false,
								 */
                        // mcode: 'UXX',
                    });

                k._XF = 'UXXHIS';
                k.setZIndex(10);
                basemap.mapvw.addOverlay(k);
                placeIdConnection[i]  =  k;
            
           
               var content = "<p style='font-size:12px;'>投诉类型: " + marks[i].BUSINESSTYPE +"</p><p style='font-size:12px;'>距离: "+ marks[i].NUM+"米</p>";
                _this.addClickHandler(content,k);
            }
           $('#sel-info-btn-id').val('周边投诉量:'+((marks.length-1)<0?0:(marks.length-1)));
           var l=new Legend();
           l.add({m:{f:'../../images/map/symbols/mark_ucl_new.png',t:'投诉点'},k:'UXXHIS'}); 
           if(has==true)
        	   {
        	   l.add({m:{f:'../../images/map/symbols/bluePlace.png',t:'周边投诉点'},k:'UXXHIS1'}); 
        	   }
        });
    },
	 addClickHandler:function(content,marker){
		var _this = this;
		marker.addEventListener("mouseover",function(e){
				_this.openInfo(content,e);
				// marker.setLabel(new BMap.Label(content, {offset: new
				// BMap.Size(30, -10), enableMassClear: false}));
			}
		);
		marker.addEventListener("mouseout",function(e){
				basemap.mapvw.closeInfoWindow();
			}
		);
	},
	 openInfo:function(content,e){
		 var opts = {
			width : 250,     // 信息窗口宽度
			height: 90,     // 信息窗口高度
			title : "信息窗口"
	   };
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
		basemap.mapvw.openInfoWindow(infoWindow,point); // 开启信息窗口
	},

    // junwei区域
    /*
	 * 区域预警画图 AreaPointS 区域经纬度 AreaName 区域信息-lng、lat、AREA_NAME
	 * 
	 */
    drawWarningArea:function (AreaPointS,AreaInfo) {

        wait.c(function () {

            lyrmgr.delMapLayerbyName(stylemap.SName.SECTOR_COLOR);// 删除小区颜色图层
            lyrmgr.delMapLayerbyName(stylemap.SName.WARNING_AREA);// 删除其他颜色图层

            var _bfz = [];
            for (var i = 0; i < AreaPointS.length; i++) {
                var ponint = coordtransform.wgs84tobd09(AreaPointS[i].lng, AreaPointS[i].lat)
                _bfz.push([ponint.lng, ponint.lat]);
            }


            var color = 'orange';
            if (AreaInfo.AREA_COLOR != null && AreaInfo.AREA_COLOR != undefined) {
                if (AreaInfo.AREA_COLOR == '红色预警') {
                    color = 'red';
                } else if (AreaInfo.AREA_COLOR == '橙色预警') {
                    color = 'orange'
                } else {
                    color = 'yellow'
                }
            }
            // 画区域
            lyrmgr.addMapLayer([{
                geometry: {
                    type: 'Polygon',
                    coordinates: [_bfz]
                }, fillStyle: color
            }], {
                mname: stylemap.SName.WARNING_AREA,
                mtype: lyrmgr.LType.DRAWMAP,
                options: {draw: 'simple', globalAlpha: 0.65}
            })
            // 增加区域名称
            var areaNamePoint = coordtransform.wgs84tobd09(AreaInfo.lng, AreaInfo.lat);

            lyrmgr.addMapLayer([{
                geometry: {
                    type: 'Point',
                    coordinates: [areaNamePoint.lng, areaNamePoint.lat]
                }, text: AreaInfo.AREA_NAME
            }], {
                mname: stylemap.SName.WARNING_AREA, mtype: lyrmgr.LType.DRAWMAP, options: {
                    draw: 'text',
                    avoid: true,
                    size: 18,
                    font: '24 Arial',
                    fillStyle: 'green',
                    shadowColor: 'blue',
                    shadowBlur: 8
                }
            })
            basemap.mapvw.panTo(new BMap.Point(areaNamePoint.lng, areaNamePoint.lat));
        });
    },


    drawPlanSite:function () {
        $Layer.drawPlanSite();
    },
    drawCluster:function (date,id,type) {
        wait.m(function () {
            $Layer.drawClusterLayer(date,id,type);
        })
    },
    drawClusterMonitor:function (name) {
        wait.m(function () {
            $Layer.drawClusterMonitorLayer(name);
        })
    },
    drawPoiSceneLayer:function (citycode,areacode, start, end,poiname,ctype,cb) {
        wait.m(function () {
            $Evt.loading.on('加载场景图层...',60);
            $Layer.drawPoiSceneLayer(citycode,areacode, start, end,poiname,ctype,cb);
        })
    },
    drawOnePoiSceneLayer:function (communityid,start,end,ctype,cb) {
        wait.m(function () {
            $Evt.loading.on('加载场景图层...',60);
            $Layer.drawOnePoiSceneLayer(communityid,start,end,ctype,cb);
        })
    },
    drawPoiTurnLayer:function (citycode,yyyymm,selectId,selectName,mapid) {
        wait.m(function () {
            $Evt.loading.on('加载场景图层...',60);
            $Layer.drawPoiTurnLayer(citycode,yyyymm,selectId,selectName,mapid);
        })
    },

    drawPoiSceneHotLayer:function () {
        wait.m(function () {
            $Evt.loading.on('加载热力图层...',60);
            $Layer.drawPoiSceneHotLayer();
        })
    }

}
u.prototype.clearLayer=function () {
    $Layer.clearLayer(['P','W','XLS','S']);
    $Layer.clearLayer(['A','D','M','X','W','UL','O','K','R','G','MLH', 'MLC','MP', 'MN']);
}
u.prototype.mapover=function () {
	
    return $param.mc;
}

/**
 * @summary 各类异常事件经纬度
 * @param {String}datehour
 *            format:yyyyMMddhh24
 * @param {String}
 *            msg abnormal event
 * @param {String}
 *            btype enum:cover/http/talk
 */
u.prototype.http=function (datehour,msg,data) {
    $param._h=[];
    $.each(data, function (a, b) {
        if ( b.LONGITUDE && b.LATITUDE) {
            var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
            $param._h.push({
                cr: c,
                xd: b.XDR_ID,
                et:b.EVENT,
                hd:datehour
            })
        }
    })
    if(!datehour||!msg||!$param._h)
        return;
    $param._x=[];

    $.each($param._h,function (a,b) {
        if(b.et==msg&&b.hd==datehour)
        {
            $param._x.push(b);
        }
    })
    wait.c(function () {
        startxdr();
    })


}
u.prototype.test=function () {
    wait.m(function () {
        var g=new geoTools.Draw(basemap.mapvw,{edit:true,compelete:function (rsl) {
            console.log(rsl)
        }})
        g.open();
    })
}
function getBusiness(_this) {
    if ($param._bs =='base') {
        return [
            {
                text: '业务图层',
                mbLayer: [
                    {
                        text: '故障基站设备',
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: '用户周边投诉点',
                        title: '一个月内周边其他用户投诉点',
                        callback: function () {
                            _this.drawLayer.drawUclPoint();
                        }
                    },
                    {
                        text: '业务分类轨迹',
                        callback: function () {
                            _this.drawLayer.drawDiffBuss();
                        }
                    },
                    {
                        text: 'MR电平覆盖',
                        callback: function () {
                            _this.drawLayer.drawMrGrid();
                        }
                    }
                    ,
                    {
                        text: '规划站点',
                        callback: function () {
                            _this.drawLayer.drawPlanSite();
                        }
                    }
                ]
            }
        ];
    }
    else if ($param._bs == 'buss')//
    {
        return [
            {
                text: '业务图层',
                mbLayer: [
                    {
                        text: 'LTE故障基站',// 分性能和退服
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: 'GSM故障基站',// 分性能和退服
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: 'LTE上行干扰',// 分不同等级
                        // title: '一个月内周边其他用户投诉点',
                        callback: function () {
                            _this.drawLayer.drawUplink();
                        }
                    }
                ]
            }
        ];
    }
    else if ($param._bs == 'bate')//
    {
        return [
            {
                text: '业务图层',
                mbLayer: [
                    {
                        text: 'LTE故障基站',// 分性能和退服
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: 'GSM故障基站',// 分性能和退服
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: 'LTE上行干扰',// 分不同等级
                        // title: '一个月内周边其他用户投诉点',
                        callback: function () {
                            _this.drawLayer.drawUplink();
                        }
                    },
                    {
                        text: '规划站点',
                        callback: function () {
                            _this.drawLayer.drawPlanSite();
                        }
                    }
                ]
            }
        ];
    }
}
// xdr分析
function startxdr() {
    // var k = setTimeout(function () {
        // $Layer.clearLayer('S');
        // $Layer.clearLayer('P');
        // $Layer.clearLayer('LS');
        // $Layer.clearLayer(['P','W','XLS','S']);
        $Layer.drawUXdrLayer();
        $Layer.drawSectorLayer([$param._c],4,'S');
        $Layer.drawSLineLayer();
        // $Layer.drawWarningLayer(true);
        // clearTimeout(k);
    // }, 500);
}

var wait=
    {
        m:function (f) {
            var k = setInterval(function () {
                if (basemap.tilesOver==true) {
                    if (f && typeof  f == 'function') {
                        f();
                    }
                    clearInterval(k);
                }
            }, 20)
        },
        c:function (f) {
        	
            var k = setInterval(function () {
                if ($param.mc && $param.mc == true) {
                    if (f && typeof  f == 'function') {
                        f();
                    }
                    clearInterval(k);
                }
            }, 20)
        },
        u:function (f) {
            var k = setInterval(function () {
                if (basemap.tilesOver==true && $param._uf == true) {
                    if (f && typeof  f == 'function') {
                        f();
                    }
                    clearInterval(k);
                }
            }, 20)
        }
    }


// 投诉点 要改
function startucl() {
    getaddress();
}

// 获取地址
function getaddress() {
    $param._u={};
    $param._uf=false;
    $Layer.drawUCLayer();
    $.ajax
    (
        {
            type: 'post',
            url: '/userperce/UCMapv/UCAddressQuery',
            data: {sno: $param._sn},// imsi,ucdate '13888759615'
            success: function (data) {
                if (data && data.length > 0) {
                    if(data[0].UE_X&&data[0].UE_Y) {
                        sectormap.ucpoint={lng:data[0].UE_X,lat:data[0].UE_Y}
                        $param._uf=true;
                        $param._u.p =coordtransform.wgs84tobd09(data[0].UE_X, data[0].UE_Y);
                        $param._u.c = data[0].UE_ADDRESS;
                        $param._u.n = data[0].ORDERNUM;
                        $param._u.d = data[0].UE_DATE;
                        $Layer.drawUCLayer();
                    }
                }
                else
                {
                    $param._uf=true;
                }
            },
            error:function (e) {
                $param._uf=true;
            }
        }
    )
}

var $Layer = {
    map: function (_map) {
        this._map = _map;
    },
    // 绘制XDR图层
    drawUXdrLayer: function () {
        this.clearLayer(['P', 'XL'])
        if (!$param._x || $param._x.length == 0)
            return;
        var f = undefined;
        var p0 = []
        // 用户点分布
        $.each($param._x, function (a, b) {
            var n = new BMap.Icon("../../images/map/symbols/mark_xdr_new.png", new BMap.Size(20, 23));//
            var k = new BMap.Marker(new BMap.Point(b.cr.lng, b.cr.lat),
                {
                    icon: n,
                    offset: {width: 0, height: -12},
                    enableMassClear: false,
                    enableClicking: false
                    // title: c.lng + '_' + c.lat
                });
            k._XF = 'P' + b.xd;
            // k.addEventListener("click", function (e) {
            // console.log(e.target.X_POINT);
            // updatebymark(e);
            // });
            basemap.mapvw.addOverlay(k);
            // 画虚线
            if (f) {
                var l = new BMap.Polyline([new BMap.Point(f.lng, f.lat), new BMap.Point(b.cr.lng, b.cr.lat)], {
                    strokeColor: 'silver',// silver
                    strokeWeight: '2',
                    strokeOpacity: '1',
                    strokeStyle: 'dashed',
                    enableMassClear: false,
                    enableClicking: false
                });
                l._XF = 'XL' + b.xd;
                basemap.mapvw.addOverlay(l);
            }
            f = b.cr;
            p0.push(b.cr);
        })
        var L = new Legend();
        L.add({m: {f: "../../images/map/symbols/mark_xdr_new.png", t: '用户轨迹'}, k: 'P'});
        if ($param._u.p)
            p0.push(new BMap.Point($param._u.p.lng, $param._u.p.lat));
        var c = $Layer.lyeAdaption(p0);
        if (c)
            basemap.mapvw.panTo(new BMap.Point(c.lng, c.lat));
        // if (!$param._u)
        // basemap.mapvw.panTo(new BMap.Point(f.lng, f.lat));

    },
    // 绘制用户投诉点
    drawUCLayer: function () {
        if ($param._u && $param._u.p) {//
            var t = new BMap.Point($param._u.p.lng, $param._u.p.lat);
            var n = new BMap.Icon("../../images/map/symbols/mark_ucl_new.png", new BMap.Size(20, 23));
            var k = new BMap.Marker(t,
                {
                    icon: n,
                    offset: {width: 0, height: -12},
                    enableMassClear: false,
                    title: $param._u.c,// 地址
                    enableClicking: false
                });
            k._XF = 'U' + $param._u.n;
            basemap.mapvw.addOverlay(k);
            basemap.mapvw.panTo(new BMap.Point($param._u.p.lng, $param._u.p.lat));
            var l = new Legend();
            l.add({m: {f: '../../images/map/symbols/mark_ucl_new.png', t: '投诉点'}, k: 'U'})
        }
    },
    /**
	 * @description 小区连线
	 * @param x
	 * @return xdrid为空返回全部
	 */
    drawSLineLayer: function (x) {
        $Layer.clearLayer('XLS', x);
        var g = $eData.get.xdr(x);
        var _s = sectormap.getSectorInfo([$param._c]);
        if (_s && _s.length > 0 && g) {
            $.each(g, function (a, b) {
                var l = new BMap.Polyline([new BMap.Point(_s[0].coord[0], _s[0].coord[1]), new BMap.Point(b.cr.lng, b.cr.lat)], {
                    strokeColor: 'silver',// silver
                    strokeWeight: '1',
                    strokeOpacity: '1',
                    strokeStyle: 'dashed',
                    enableMassClear: false,
                    enableClicking: false
                });
                l._XF = 'XLS' + (x || '');
                basemap.mapvw.addOverlay(l);
            })
        }
    },
    /**
	 * 
	 * @param {boolean}
	 *            [d]
	 */
    drawWarningLayer: function (d) {
        $Evt.loading.on('加载告警...', 60);
        var item = {};
        if ($param._bs == 'buss') {
            if ($param._x && $param._x._w) {
                var g = sectormap.get();
                var t;
                for (var key in $param._x._w) {
                    var _g = g[key];
                    var v = $param._x._w[key];
                    if (_g) {
                        t = new BMap.Point(_g.c[0], _g.c[1]);
                        var _ico = getico(v.c);
                        var n = new BMap.Icon(_ico, new BMap.Size(30, 52));
                        var k = new BMap.Marker(t,
                            {
                                icon: n,
                                enableMassClear: false,
                                enableClicking: false,
                                title: key + '\n' + v.t,
                                rotation: _g.d
                            })
                        k._XF = 'W' + _ico;
                        k.setTop(true);
                        basemap.mapvw.addOverlay(k);
                        if (!(v.c in item)) {
                            item[v.c] = _ico;
                        }
                    }
                }
                if (t)
                    basemap.mapvw.panTo(t);
                g = null;

                var l = new Legend();
                for (var _m in item) {
                    l.add({m: {f: item[_m], t: (_m == 8 ? '性能告警' : '退服告警')}, k: 'W' + _m});
                }
            }
            $Evt.loading.off();
            return;
        }

        var s = null;// null
        if (d == true && $param._c)
            s = $param._c;
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/UCGetEnbWarning',
            data: {date: $param._xd, sector: s, lng: $param._u.p.lng, lat: $param._u.p.lat},//
            success: function (r) {
                if (r) {
                    var n;
                    var s = sectormap.get();
                    if (!s)
                        return;
                    var t;
                    for (var _k in r) {
                        var sp = _k.split('|');
                        if (sp.length == 2) {
                            var p = s[sp[0]];
                            if (p) {
                                t = new BMap.Point(p.c[0], p.c[1]);
                                var _ico = getico(parseInt(sp[1]))
                                n = new BMap.Icon(_ico, new BMap.Size(30, 52));
                                var k = new BMap.Marker(t,
                                    {
                                        icon: n,
                                        enableMassClear: false,
                                        title: r[_k],
                                        enableClicking: false,
                                        rotation: p.d
                                    })
                                k._XF = 'W' + p.s;
                                k.setTop(true);
                                basemap.mapvw.addOverlay(k);
                                if (!(parseInt(sp[1]) in item)) {
                                    item[parseInt(sp[1])] = _ico;
                                }
                            }
                        }
                    }
                    s = null;
                    var l = new Legend();
                    for (var _m in item) {
                        l.add({m: {f: item[_m], t: (_m == 8 ? '性能告警' : '退服告警')}, k: 'W' + _m});
                    }
                    // basemap.mapvw.panTo(new BMap.Point($param._u.p.lng), new
					// BMap.Point($param._u.p.lat));
                    r = null;
                }
                $Evt.loading.off();
            },
            error: function () {
            }
        });
    },
    drawGSMWarningLayer: function () {
        $Evt.loading.on('加载告警...', 60);
        var item = {};
        if ($param._bs == 'buss') {
            if ($param._x && $param._x._gw) {
                var g = sectormap.get();
                var t;
                for (var key in $param._x._gw) {
                    var _g = g[key];
                    var v = $param._x._gw[key];
                    if (_g) {
                        t = new BMap.Point(_g.c[0], _g.c[1]);
                        var _ico = getico(v.c);
                        var n = new BMap.Icon(_ico, new BMap.Size(30, 52));
                        var k = new BMap.Marker(t,
                            {
                                icon: n,
                                enableMassClear: false,
                                enableClicking: false,
                                title: key + '\n' + v.t,
                                rotation: _g.d
                            })
                        k._XF = 'G' + _ico;
                        k.setTop(true);
                        basemap.mapvw.addOverlay(k);
                        if (!(v.c in item)) {
                            item[v.c] = _ico;
                        }
                    }
                }
                if (t)
                    basemap.mapvw.panTo(t);
                g = null;

                var l = new Legend();
                for (var _m in item) {
                    l.add({m: {f: item[_m], t: (_m == 8 ? '性能告警' : '退服告警')}, k: 'W' + _m});
                }
            }
            $Evt.loading.off();
            return;
        }
    },
    drawAroundUserPoint: function () {
        $Evt.loading.on('加载周边投诉点...', 60);
        $.ajax(
            {
                type: 'post',
                url: "/userperce/UCMapv/UCGetOtherUserPoints",
                data: {sn: $param._u.n, date: $param._u.d},
                success: function (r) {
                    if (r) {
                        $.each(r, function (a, b) {
                            var c = coordtransform.wgs84tobd09(b.UE_X, b.UE_Y);
                            var t = new BMap.Point(c.lng, c.lat);
                            var n = new BMap.Icon(getico(0), new BMap.Size(20, 23));
                            var k = new BMap.Marker(t,
                                {
                                    icon: n,
                                    offset: {width: 0, height: -12},
                                    enableMassClear: false,
                                    title: b.SENDTIME + ' ' + b.BUSSINESSCONTENT,
                                    enableClicking: false
                                });
                            k._XF = 'A' + b.ORDERNUM;
                            basemap.mapvw.addOverlay(k);
                        })
                        var led = new Legend();
                        led.add({m: {f: getico(0), t: '周边投诉点'}, k: 'A'});
                    }
                    $Evt.loading.off();
                },
                error: function () {

                }
            }
        )
    },
    drawDiffBussLayer: function () {
        $Evt.loading.on('加载业务分类轨迹...', 60);
        this.clearLayer('D');
        $.ajax(
            {
                type: 'post',
                url: "/userperce/UCMapv/UCGetContextTypeData",
                data: {date: $param._xd, cityCode: $param._me, imsi: $param._ms, tp: $param._tp},
                success: function (r) {
                    console.log(r);
                    if (r) {
                        var t;
                        $.each(r, function (a, b) {
                            $.each(b, function (i, j) {
                                var ar = j.split('|');
                                if (ar.length == 4) {
                                    var c = coordtransform.wgs84tobd09(ar[1], ar[2]);
                                    t = new BMap.Point(c.lng, c.lat);
                                    var n = new BMap.Icon(getico(parseInt(a)), new BMap.Size(20, 23));
                                    var k = new BMap.Marker(t,
                                        {
                                            icon: n,
                                            offset: {width: 0, height: -12},
                                            enableMassClear: false,
                                            title: ar[3],
                                            enableClicking: false
                                        });
                                    k._XF = 'D' + ar[0];
                                    basemap.mapvw.addOverlay(k);
                                }
                            })

                        })
                        if (t)
                            basemap.mapvw.panTo(t);
                    }
                    $Evt.loading.off();
                }
            }
        );
    },
    drawUplinkLevel: function () {
        console.log("uplink")
        $Evt.loading.on('加载上行干扰分布...', 60);
        if ($param._x._u) {
            var p = sectormap.get();
            if (!p)
                return;
            var t;
            for (var key in $param._x._u) {
                var s = p[key]
                var v = $param._x._u[key]
                if (s) {
                    var n;
                    if (v == "轻度干扰") {
                        n = new BMap.Icon(getico(5), new BMap.Size(30, 52));
                    }
                    else if (v == "中度干扰") {
                        n = new BMap.Icon(getico(6), new BMap.Size(30, 52));
                    }
                    else if (v == "重度干扰") {
                        n = new BMap.Icon(getico(7), new BMap.Size(30, 52));
                    }
                    t = new BMap.Point(s.c[0], s.c[1]);
                    var k = new BMap.Marker(t,
                        {
                            icon: n,
                            enableMassClear: false,
                            enableClicking: false,
                            title: key,
                            rotation: s.d
                        })
                    k._XF = 'UL' + key;
                    k.setTop(true);
                    basemap.mapvw.addOverlay(k);
                }
            }
            if (t)
                basemap.mapvw.panTo(t);
            p = null;
        }
        $Evt.loading.off();
    },

    /**
	 * @description s 小区列表 t标识
	 * @param {Array}
	 *            s
	 * @param {Number}
	 *            n
	 * @param {String}
	 *            f
	 * @param {Boolen}
	 *            [l] isLine
	 */
    drawSectorLayer: function (s, n, f, l) {
        console.log("line");
        if (!s)
            return;
        var _s;
        if (s instanceof Array) {
            _s = sectormap.getSectorInfo(s);
        }
        else {
            _s = sectormap.getSectorInfo([s]);
        }
        var t;
        var g = [];
        
        if (_s && _s.length > 0) {
        	
            $.each(_s, function (a, b) {
                t = new BMap.Point(b.coord[0], b.coord[1]);
                var _n = new BMap.Icon(getico(n), new BMap.Size(30, 52));
                var k = new BMap.Marker(t,
                    {
                        icon: _n,
                        // offset:{width:0,height:-13},
                        enableMassClear: false,
                        enableClicking: f == 'L' ? true : false,
                        title: b.sector,
                        rotation: b.deg
                    })
                k._XF = f + b.sector;

                // 右键菜单
                basemap.mapvw.addOverlay(k);
                if (f == 'L' && $param._bs == 'base') {
                    if (!$Layer._cl)
                        $Layer._cl = {};
                    $Layer._cl[b.sector] = "";
                }
                g.push(t);
            })
            var led = new Legend();
            if (f == 'S') {
                led.add({m: {f: '../../images/map/symbols/sector-pos-3026.png', t: '定位小区'}, k: f});
                if (t)
                    basemap.mapvw.panTo(t);
            }
            else if (f == 'L') {
                led.add({m: {f: '../../images/map/symbols/sector-sel-3026.png', t: '选择小区'}, k: f});
            }
            if (l) {
                if (g.length == 2) {
                    var _l = new BMap.Polyline([g[0], g[1]], {
                        strokeColor: 'blue',// silver
                        strokeWeight: '1',
                        strokeOpacity: '1',
                        strokeStyle: 'dashed',
                        enableMassClear: false,
                        enableClicking: false
                    });
                    _l._XF = 'X' + f;
                    basemap.mapvw.addOverlay(_l);
                    led.add({m: {f: getico(18), t: '同频模三'}, k: 'X'});
                }
            }
            if (f == 'L')
                $Layer.lyeAdaption(g);
        }
    },
    drawNbSectorLayer: function (s, n, f, l) {
        if (!s && s[0]!=undefined)
            return;
        var _s;
        //
        if (s instanceof Array) {
            _s = sectormap.getSectorInfo(s);
        }
        else {
            _s = sectormap.getSectorInfo([s]);
        }
        var t;
        var g = [];

        if (_s && _s.length > 0) {

            $.each(_s, function (a, b) {
                t = new BMap.Point(b.coord[0], b.coord[1]);
                var _n = new BMap.Icon(getico(n), new BMap.Size(30, 52));
                var k = new BMap.Marker(t,
                    {
                        icon: _n,
                        // offset:{width:0,height:-13},
                        enableMassClear: false,
                        enableClicking: f == 'L' ? true : false,
                        title: b.sector,
                        rotation: b.deg
                    })
                k._XF = f + b.sector;

                // 右键菜单
                basemap.mapvw.addOverlay(k);
                if (f == 'L' && $param._bs == 'base') {
                    if (!$Layer._cl)
                        $Layer._cl = {};
                    $Layer._cl[b.sector] = "";
                }
                g.push(t);
            })
            var led = new Legend();
            if (f == 'S') {
                led.add({m: {f: '../../images/map/symbols/sector-pos-3026.png', t: '定位小区'}, k: f});
                if (t)
                    basemap.mapvw.panTo(t);
            }
            else if (f == 'L') {
                led.add({m: {f: '../../images/map/symbols/sector-sel-3026.png', t: '选择小区'}, k: f});
            }
            if (l) {
                if (g.length == 2) {
                    var _l = new BMap.Polyline([g[0], g[1]], {
                        strokeColor: 'blue',// silver
                        strokeWeight: '1',
                        strokeOpacity: '1',
                        strokeStyle: 'dashed',
                        enableMassClear: false,
                        enableClicking: false
                    });
                    _l._XF = 'X' + f;
                    basemap.mapvw.addOverlay(_l);
                    led.add({m: {f: getico(18), t: '同频模三'}, k: 'X'});
                }
            }
            if (f == 'L')
                $Layer.lyeAdaption(g);
        }
    },
    drawSectorLineLayer: function (s, lng,lat,n, f, l) {
        if (!s && s[0]!=undefined)
            return;
        var _s;
        if (s instanceof Array) {
            _s = sectormap.getSectorInfo(s);
        }
        else {
            _s = sectormap.getSectorInfo([s]);
        }
        var t;
        var g = [];

        if (_s && _s.length > 0) {

            $.each(_s, function (a, b) {
                t = new BMap.Point(b.coord[0], b.coord[1]);
                var _n = new BMap.Icon(getico(n), new BMap.Size(30, 52));
                var k = new BMap.Marker(t,
                    {
                        icon: _n,
                        // offset:{width:0,height:-13},
                        enableMassClear: false,
                        enableClicking: f == 'L' ? true : false,
                        title: b.sector,
                        rotation: b.deg
                    })
                k._XF = f + b.sector;

                // 右键菜单
                basemap.mapvw.addOverlay(k);
                if (f == 'L' && $param._bs == 'base') {
                    if (!$Layer._cl)
                        $Layer._cl = {};
                    $Layer._cl[b.sector] = "";
                }
                g.push(t);
                var orderpoint = coordtransform.wgs84tobd09(lng,lat);
                var linepoint = new BMap.Polyline([new BMap.Point(b.coord[0], b.coord[1]), new BMap.Point(orderpoint.lng, orderpoint.lat)], {
                    strokeColor: 'blue',// silver
                    strokeWeight: '5',
                    strokeOpacity: '1',
                    strokeStyle: 'dashed',
                    enableMassClear: false,
                    enableClicking: false
                });
                linepoint._XF = 'R';
                basemap.mapvw.addOverlay(linepoint);
            })



            var led = new Legend();
            if (f == 'S') {
                led.add({m: {f: '../../images/map/symbols/sector-pos-3026.png', t: '定位小区'}, k: f});
                if (t)
                    basemap.mapvw.panTo(t);
            }
            else if (f == 'L') {
                led.add({m: {f: '../../images/map/symbols/sector-sel-3026.png', t: '选择小区'}, k: f});
            }
            led.add({m: {f: getico(18), t: '连线'}, k: 'R'})
            if (l) {
                if (g.length == 2) {
                    var _l = new BMap.Polyline([g[0], g[1]], {
                        strokeColor: 'blue',// silver
                        strokeWeight: '1',
                        strokeOpacity: '1',
                        strokeStyle: 'dashed',
                        enableMassClear: false,
                        enableClicking: false
                    });
                    _l._XF = 'X' + f;
                    basemap.mapvw.addOverlay(_l);
                    led.add({m: {f: getico(18), t: '同频模三'}, k: 'X'});
                }
            }
            if (f == 'L')
                $Layer.lyeAdaption(g);
        }
    },
    drawMrRsrpGird: function () {
        $Evt.loading.on('加载MR RSRP栅格...', 60);
        this.drawCutter();
        $Evt.loading.off();
        return;
       
//         var md=_parameters._xdate.substr(0,8);
//         lyrmgr.delMapLayerbyName(stylemap.SName.UCMRGRID);
//         $.ajax(
//         {
//         type: 'post',
//         url: "/userperce/UCMapv/UCGetMrGrid",
//         data: {
//         citycode:$param._me, //
//         date: ($param._xd||$param._md),
//         lng: $param._u.p.lng,//,
//         lat: $param._u.p.lat//
//         },
//         success: function (r) {
//         console.log(r)
//         if (r && r.length > 0) {
//         stylemap.setGridStyle(r, {
//         showmsg: false,//是否在网格上显示信息
//         width: 74,
//         height: 78,
//         opacity: 0.8,
//         lgdname: "MR-RSRP栅格"
//         }, stylemap.SName.UCMRGRID);
//         }
//         }
//         }
//         )
    },
    drawSectorRsrpGrid: function (s) {
        if (!s)
            return;
        $Evt.loading.on('加载小区RSRP覆盖栅格...', 60);
        lyrmgr.delMapLayerbyName(stylemap.SName.UCSMRGRID);
        $.ajax(
            {
                type: 'post',
                url: "/userperce/UCMapv/UCGetSectorMrGrid",
                data: {
                    citycode: $param._me, //
                    date: ($param._xd || $param._md),
                    sector: s
                },
                success: function (r) {
                    if (r && r.length > 0) {
                        stylemap.setGridStyle(r, {
                            showmsg: false,// 是否在网格上显示信息
                            width: 74,
                            height: 78,
                            opacity: 0.8,
                            lgdname: "小区RSRP栅格"
                        }, stylemap.SName.UCSMRGRID);
                    }
                    else
                        msg("无小区RSRP数据.");
                    $Evt.loading.off();
                }
            }
        )
    },
    drawUserRsrpGrid: function (s) {
        if (!s)
            return;
        $Evt.loading.on('加载用户RSRP覆盖栅格...', 60);
        lyrmgr.delMapLayerbyName(stylemap.SName.USERMRGRID);
        $.ajax(
            {
                type: 'post',
                url: "/userperce/UCMapv/UCGetUserSectorMrGrid",
                data: {
                    citycode: $param._me, //
                    date: ($param._xd || $param._md),
                    sector: s,
                    imsi: $param._mi
                },
                success: function (r) {
                    console.log(r);
                    if (r && r.length > 0) {
                        stylemap.setPointStyle(r, {
                            showmsg: false,
                            opacity: 0.8,
                            size: 4,
                            lgdname: "用户RSRP覆盖"
                        }, stylemap.SName.USERMRGRID);
                    }
                    else
                        msg("无用户RSRP数据.");
                    $Evt.loading.off();
                }
            }
        )
    },
    drawCutter: function () {
        if (!$param._u.p)
            return;
        console.log($param._u.p);

        // 10km
        var rt = (new BMap.MercatorProjection).lngLatToPoint(new BMap.Point($param._u.p.lng + 0.1, $param._u.p.lat + 0.09));
        var lb = (new BMap.MercatorProjection).lngLatToPoint(new BMap.Point($param._u.p.lng - 0.1, $param._u.p.lat - 0.09));
        var c = new MapCutter();
        c.get($param._me, ($param._xd || $param._md), 'MRRSRP_UC', lb.x + '_' + rt.x + '_' + lb.y + '_' + rt.y);
        if (c.set(basemap.mapvw.getZoom()) == true) {
            c.setLegend();
        }
        basemap.AddTileEvent();
    },
    drawPlanSite: function () {
        $Evt.loading.on('加载规划站分布...', 60);
        this.clearLayer('K');
        $.ajax(
            {
                type: 'post',
                url: "/userperce/UCMapv/UCGetPlanSite",
                data: {lng: $param._u.p.lng, lat: $param._u.p.lat},
                success: function (r) {
                    if (r) {
                        $.each(r, function (a, b) {
                            var c = coordtransform.wgs84tobd09(b.LONGITUDE, b.LATITUDE);
                            var t = new BMap.Point(c.lng, c.lat);
                            var n = new BMap.Icon(getico(17), new BMap.Size(23, 23));
                            var k = new BMap.Marker(t,
                                {
                                    icon: n,
                                    offset: {width: 0, height: -12},
                                    enableMassClear: false,
                                    title: b.SITENAME,
                                    enableClicking: false
                                });
                            k._XF = 'K' + b.SITENAME;
                            basemap.mapvw.addOverlay(k);
                        })
                        var led = new Legend();
                        led.add({m: {f: getico(17), t: '规划站点'}, k: 'K'})
                        $Evt.loading.off();
                    }
                },
                error: function () {

                }
            }
        )
    },
    drawCellLine: function (cells) {
        var tc = sectormap.getSectorInfo(cells);
        var sc = sectormap.getSectorInfo([$param._c]);
        if (tc) {
            $.each(tc, function (a, b) {
                var l = new BMap.Polyline([new BMap.Point(sc[0].coord[0], sc[0].coord[1]), new BMap.Point(b.coord[0], b.coord[1])], {
                    strokeColor: 'blue',// silver
                    strokeWeight: '1',
                    strokeOpacity: '1',
                    strokeStyle: 'dashed',
                    enableMassClear: false,
                    enableClicking: false
                });
                l._XF = 'R';
                basemap.mapvw.addOverlay(l);
            })
            var led = new Legend();
            led.add({m: {f: getico(18), t: '乒乓切换'}, k: 'R'})
            tc = null;
            sc = null;
        }
    },
    drawGSMWarningLayerTemp: function () {
        this.clearLayer('G');
        var str = "1864;15261;15262;15263;15151;15152;15153;15181;15351;21404;21405;21406;31501;31502;38289;38185;38187;38189;38284;38285;38286;38287;38288;42602;42605;44561;44562;44563;49574;50694;50695;54924;56264;54774;54775";
        var ss = str.split(';');
        var g = sectormap.get();
        var t;
        $.each(ss, function (a, key) {
            console.log(key);
            var _g = g[key];
            if (_g) {
                t = new BMap.Point(_g.c[0], _g.c[1]);
                var _ico = getico(19);
                var n = new BMap.Icon(_ico, new BMap.Size(20, 36));
                var k = new BMap.Marker(t,
                    {
                        icon: n,
                        enableMassClear: false,
                        enableClicking: false,
                        // title: key + '\n' + v.t,
                        rotation: _g.d
                    })
                k._XF = 'G' + 19;
                k.setTop(true);
                basemap.mapvw.addOverlay(k);
            }
        });

        var l = new Legend();
        l.add({m: {f: getico(19), t: 'GSM告警'}, k: 'G'})
    },
    /**
	 * @description 区域簇
	 */
    drawClusterLayer: function (date, cid, type) {
        lyrmgr.delMapLayerbyName(stylemap.SName.HOTCLUSTER);
        var l = new Legend();
        l.close(['MLH', 'MLC']);
        var name;
        if (type == 0) {
            name = 'getClusterDayP';
        }
        else {
            name = 'getClusterMonP';
        }
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/' + name,
            data: {city: $param._me, date: date, cid: cid},
            success: function (data) {
                if (!data || data.length == 0)
                    return;
                var c;
                var _data = [];
                var _bfz = [];
                var img0 = new Image();
                img0.src = '../../images/map/symbols/mark_ucl_new.png';
                var img1 = new Image();
                img1.src = '../../images/map/symbols/mark_net_brower.png';
                var img2 = new Image();
                img2.src = '../../images/map/symbols/mark_net_vedio.png';
                $.each(data.CPOINT, function (a, b) {
                    var m;
                    if (a == '语音通信') {
                        m = img0;
                    }
                    else if (a == '数据通信') {
                        m = img1;
                    }
                    else if (a == '基础通信') {
                        m = img2;
                    }
                    $.each(b, function (i, j) {
                        c = coordtransform.wgs84tobd09(j.x, j.y);
                        if (m) {
                            _data.push({
                                geometry: {
                                    type: 'Point',
                                    coordinates: [c.lng, c.lat]
                                }, deg: 359,
                                icon: m
                            })
                        }
                    })
                });

                c = coordtransform.wgs84tobd09(data.C_LONGITUDE, data.C_LATITUDE);
                if (data.BUFFERZONE) {
                    $.each(data.BUFFERZONE, function (a, b) {
                        _bfz.push([b.x, b.y]);
                    });
                    lyrmgr.addMapLayer([{
                        geometry: {
                            type: 'Polygon',
                            coordinates: [_bfz]
                        }, fillStyle: "green"
                    }], {
                        mname: stylemap.SName.HOTCLUSTER,
                        mtype: lyrmgr.LType.DRAWMAP,
                        options: {draw: 'simple', globalAlpha: 0.65}// lineWidth:
																	// 2
                    })
                }
                else if (data.RADIUS) {
                    console.log(data.RADIUS);
                    lyrmgr.addMapLayer([{
                        geometry: {
                            type: 'Point',
                            coordinates: [c.lng, c.lat]
                        }, fillStyle: "green"
                    }], {
                        mname: stylemap.SName.HOTCLUSTER,
                        mtype: lyrmgr.LType.DRAWMAP,
                        options: {draw: 'simple', symbol: 'circle', size: data.RADIUS, unit: 'm', globalAlpha: 0.65}// lineWidth:
																													// 2
                    })
                }

                lyrmgr.addMapLayer(_data, {
                    mname: stylemap.SName.HOTCLUSTER,
                    mtype: lyrmgr.LType.DRAWMAP,
                    options: {draw: 'icon', height: 46,zIndex:9999}
                })
                lyrmgr.addMapLayer([{
                    geometry: {
                        type: 'Point',
                        coordinates: [c.lng, c.lat]
                    }, text: data.CLUSTERNAME
                }], {
                    mname: stylemap.SName.HOTCLUSTER, mtype: lyrmgr.LType.DRAWMAP, options: {
                        draw: 'text',
                        avoid: true,
                        size: 18,
                        font: '24 Arial',
                        fillStyle: 'green',
                        shadowColor: 'blue',
                        shadowBlur: 8
                    }
                })
                if (c)
                    basemap.mapvw.panTo(new BMap.Point(c.lng, c.lat));
                l.add({
                    m: {f: '', t: '投诉点'},
                    k: 'MLC',
                    s: [{
                        f: '../../images/map/symbols/mark_ucl_new.png',
                        t: '语音通信'
                    }, {
                        f: '../../images/map/symbols/mark_net_brower.png',
                        t: '数据通信'
                    }, {f: '../../images/map/symbols/mark_net_vedio.png', t: '基础通信'}]
                })
                l.add({m: {f: 'green', t: '热点区域'}, k: 'MLH'})
            },
            error: function (e) {

            }
        })
    },

    drawClusterMonitorLayer: function (name) {
        var l = new Legend();
        var sn = stylemap.SName.MONITORCLUSTERS;
        var clr;
        // var cs=["green","yellow","blue","red"]
        if (name) {
            sn = stylemap.SName.MONITORCLUSTER;
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTER);
            l.close('MN');
            clr = 'green';
        }
        else {
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTERS);
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTER);
            l.close(['MP', 'MN']);
            clr = 'yellow';
        }
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/getClusterMonitorP',
            data: {city: $param._me, name: name},
            success: function (data) {
                if (!data || data.length == 0)
                    return;
                // console.log("data");
                // console.log(data);
                var c;
                if (name) {
                    c = coordtransform.wgs84tobd09(data[0].center.x, data[0].center.y);
                    basemap.mapvw.panTo(new BMap.Point(c.lng, c.lat));
                    return;
                }
                var ps = [];
                var _line = [];
                var label = [];
                var rd = [];
                $.each(data, function (i, j) {
                    c = coordtransform.wgs84tobd09(j.center.x, j.center.y);
                    if (!j.radius) {
                        $.each(j.mapPoints, function (a, b) {
                            // c = coordtransform.wgs84tobd09(b.x, b.y);
                            _line.push([b.x, b.y]);
                        })

                        ps.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [_line]
                            }, fillStyle: clr
                        })
                        _line = [];
                    }
                    else {
                        rd.push(
                            {
                                geometry: {
                                    type: 'Point',
                                    coordinates: [c.lng, c.lat]
                                }, fillStyle: clr, size: j.radius
                            }
                        )
                    }
                    label.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [c.lng, c.lat]
                        }, text: j.name
                    })
                })
                if (ps.length > 0) {
                    lyrmgr.addMapLayer(ps, {
                        mname: stylemap.SName.MONITORCLUSTERS,
                        mtype: lyrmgr.LType.DRAWMAP,
                        options: {draw: 'simple', globalAlpha: 0.7}
                    })
                }

                if (rd.length > 0) {
                    lyrmgr.addMapLayer(rd, {
                        mname: stylemap.SName.MONITORCLUSTERS,
                        mtype: lyrmgr.LType.DRAWMAP,
                        options: {draw: 'simple', symbol: 'circle', unit: 'm', globalAlpha: 0.7}
                    })
                }

                lyrmgr.addMapLayer(label, {
                    mname: stylemap.SName.MONITORCLUSTERS, mtype: lyrmgr.LType.DRAWMAP, options: {
                        draw: 'text',
                        avoid: true,
                        size: 18,
                        font: '24 Arial',
                        fillStyle: clr,
                        shadowColor: 'blue',
                        shadowBlur: 12
                    }
                })
                l.add({m: {f: clr, t: '监控区域'}, k: 'MP'})
                if (name) {
                    l.add({m: {f: clr, t: '选择区域'}, k: 'MN'})
                }
                basemap.mapvw.panTo(new BMap.Point(c.lng, c.lat));
            },
            error: function (e) {

            }
        })
    },
    drawPoiSceneLayer: function (citycode,areacode, start, end,poiname,ctype,cb) {
        $Layer.removeLayer("poiscene")
        $Layer.removeLayer("poicomplaint")
        var Led=new Legend();
        Led.close("poiscene");
        Led.close("poicomplaint");
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/getPoiScene',
            data: {citycode: citycode,areacode:areacode, start: start, end: end,poiname:poiname,ctype:ctype},
            success: function (data) {
                if (!data || data.length == 0) {
                    if (cb && typeof cb == 'function') {
                        cb(null);
                    }
                    $Evt.loading.off();
                    return;
                }
                var coords = [];
                var coord = null;
                var panto;
                var top = [];
                $.each(data, function (a, b) {
                    var cds = [];
                    if (b.LOCATIONS) {
                        $.each(b.LOCATIONS, function (c, d) {
                            coord = coordtransform.wgs84tobd09(d.LNG, d.LAT);
                            if(!panto)
                                panto=coord;
                            cds.push([coord.lng, coord.lat])
                        })
                    }
                    var clr = '#8CEA00';
                    if (b.CNT >= 20) {
                        clr = 'red';
                    }
                    else if (b.CNT >= 10) {
                        clr = 'yellow';
                    }
                    else if (b.CNT >= 5) {
                        clr = 'blue';
                    }
                    else if (b.CNT >= 1) {
                        clr = 'green';
                    }
                    if (cds) {
                        coords.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [cds]
                            }
                            ,
                            fillStyle: clr,
                            txt: b.COMMUNITY_NAME,
                            tag: b.TAG,
                            id: b.COMMUNITY_ID,
                            clng: b.C_LNG,
                            clat: b.C_LAT,
                            s: start,
                            e: end
                        })
                    }
                    top.push({'name': b.COMMUNITY_NAME, 'tag': b.TAG, 'cnt': b.CNT, 'lng': b.C_LNG, 'lat': b.C_LAT, 'id': b.COMMUNITY_ID, 'areaname': b.AREANAME})
                })
                if (coords.length > 0) {
                    var ops = {
                        draw: 'simple',//
                        globalAlpha: 0.6,
                        methods: {
                            mousemove: function (e) {
                                if (!e || e.length == 0) {
                                    $('.basemap canvas').css('cursor', 'default')
                                    $('#map-tip').css('display', 'none');
                                    return;
                                }
                                var o = e[0];
                                var c = coordtransform.wgs84tobd09(o.clng, o.clat);
                                var s = basemap.mapvw.pointToPixel(new BMap.Point(c.lng, c.lat));
                                $('#map-tip').html("<p>场景：" + o.txt + "</p><p>标签：" + o.tag + "</p>");
                                $('#map-tip').css('left', s.x + 'px');
                                $('#map-tip').css('top', s.y + 'px');
                                $('.basemap canvas').css('cursor', 'pointer');
                                $('#map-tip').css('display', 'block');
                            },
                            click: function (e) {
                                if (!e || e.length == 0) {
                                    return;
                                }
                                var o = e[0];
                                $Layer.drawSceneComplaintLayer(o.id, o.s, o.e,ctype);
                            },

                        }, mcode: 'poiscene'
                    }
                    var md = new mapv.DataSet(coords);
                    var map = new mapv.baiduMapLayer(basemap.mapvw, md, ops);
                    // 图例
                    Led.add({
                        m: {f: '', t: '场景'},
                        k: 'poiscene',
                        s: [{
                            f: '#8CEA00',
                            t: '[0,1)'
                        }, {
                            f: 'green',
                            t: '[1,5)'
                        },
                            {
                                f: 'blue',
                                t: '[5,10)'
                            },
                            {f: 'yellow',
                                t: '[10,20)'}
                            ,
                            {f: 'red', t: '[20,∞)'}
                        ]
                    })
                }
                basemap.mapvw.panTo(new BMap.Point(panto.lng, panto.lat))
                $Evt.loading.off();
                if (cb && typeof cb == 'function') {
                    cb(top);
                }
                top = null;
                // showTable(top);
            },
            error: function (e) {
                $Evt.loading.off();
            }
        })
    },
    drawOnePoiSceneLayer: function (communityid,start, end,ctype, cb) {
        $Layer.removeLayer("poiscene")
        var Led=new Legend();
        Led.close("poiscene");
        Led.close("poicomplaint");
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/getOnePoiScene',
            data: {communityid:communityid,citycode: $param._me, start: start, end: end,ctype:ctype},
            success: function (data) {
                if (!data || data.length == 0) {
                    $Evt.loading.off();
                    return;
                }
                var coords = [];
                var coord = null;
                var top = [];
                $.each(data, function (a, b) {
                    var cds = [];
                    if (b.LOCATIONS) {
                        $.each(b.LOCATIONS, function (c, d) {
                            coord = coordtransform.wgs84tobd09(d.LNG, d.LAT);
                            cds.push([coord.lng, coord.lat])
                        })
                    }
                    var clr = '#8CEA00';
                    if (b.CNT >= 20) {
                        clr = 'red';
                    }
                    else if (b.CNT >= 10) {
                        clr = 'yellow';
                    }
                    else if (b.CNT >= 5) {
                        clr = 'blue';
                    }
                    else if (b.CNT >= 1) {
                        clr = 'green';
                    }
                    if (cds) {
                        coords.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [cds]
                            }
                            ,
                            fillStyle: clr,
                            txt: b.COMMUNITY_NAME,
                            tag: b.TAG,
                            id: b.COMMUNITY_ID,
                            clng: b.C_LNG,
                            clat: b.C_LAT,
                            s: start,
                            e: end
                        })
                    }
                    top.push({'name': b.COMMUNITY_NAME, 'tag': b.TAG, 'cnt': b.CNT, 'lng': b.C_LNG, 'lat': b.C_LAT})
                })
                if (coords.length > 0) {
                    var ops = {
                        draw: 'simple',//
                        globalAlpha: 0.6,
                        methods: {
                            mousemove: function (e) {
                                if (!e || e.length == 0) {
                                    $('.basemap canvas').css('cursor', 'default')
                                    $('#map-tip').css('display', 'none');
                                    return;
                                }
                                var o = e[0];
                                var c = coordtransform.wgs84tobd09(o.clng, o.clat);
                                var s = basemap.mapvw.pointToPixel(new BMap.Point(c.lng, c.lat));
                                $('#map-tip').html("<p>场景：" + o.txt + "</p><p>标签：" + o.tag + "</p>");
                                $('#map-tip').css('left', s.x + 'px');
                                $('#map-tip').css('top', s.y + 'px');
                                $('.basemap canvas').css('cursor', 'pointer');
                                $('#map-tip').css('display', 'block');
                            },
                            click: function (e) {
                                if (!e || e.length == 0) {
                                    return;
                                }
                                var o = e[0];
                                $Layer.drawSceneComplaintLayer(o.id, o.s, o.e,ctype);
                            },

                        }, mcode: 'poiscene'
                    }
                    var md = new mapv.DataSet(coords);
                    var symbol = basemap.mapvw.getZoom();
                    basemap.mapvw.setZoom(symbol-1);
                    var map = new mapv.baiduMapLayer(basemap.mapvw, md, ops);
                    // 图例
                    Led.add({
                        m: {f: '', t: '场景'},
                        k: 'poiscene',
                        s: [{
                            f: '#8CEA00',
                            t: '[0,1)'
                        }, {
                            f: 'green',
                            t: '[1,5)'
                        },
                            {
                                f: 'blue',
                                t: '[5,10)'
                            },
                            {f: 'yellow',
                                t: '[10,20)'}
                            ,
                            {f: 'red', t: '[20,∞)'}
                        ]
                    })
                }
                basemap.mapvw.panTo(new BMap.Point(coord.lng, coord.lat))
                $Evt.loading.off();
                if (cb && typeof cb == 'function') {
                    cb(top);
                }
                top = null;
                // showTable(top);
            },
            error: function (e) {
                $Evt.loading.off();
            }
        })
    },
    drawPoiTurnLayer: function (citycode,yyyymm,selectId,secetorName,mapid) {
        $Layer.removeLayer("poiscene")
        var Led=new Legend();
        Led.close("poiscene");
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/perceTurnGis',
            data: {citycode: citycode,yyyymm:yyyymm, selectId: selectId},
            success: function (data) {
                if (!data || data.length == 0) {
                    if (cb && typeof cb == 'function') {
                        cb(null);
                    }
                    $Evt.loading.off();
                    return;
                }
                var coords = [];
                var coord = null;
                var panto;
                var top = [];
                $.each(data, function (a, b) {
                    var cds = [];
                    if (b.LOCATIONS) {
                        $.each(b.LOCATIONS, function (c, d) {
                            coord = coordtransform.wgs84tobd09(d.LNG, d.LAT);
                            if(!panto)
                                panto=coord;
                            cds.push([coord.lng, coord.lat])
                        })
                    }

                    var tu=(b.TULI).split('@');
                    var t0=tu[0].split('&');
                    var t1=tu[1].split('&');
                    var t2=tu[2].split('&');
                    var t3=tu[3].split('&');

                    var clr = '#8CEA00';
                    // if (b.CNT >= t3[2]) {
                    //     clr = 'red';
                    // }
                    if  (b.CNT >= t2[2]) {
                        clr = 'red';
                    }
                    else if (b.CNT >= t1[2]) {
                        clr = 'yellow';
                    }
                    else if (b.CNT >= t0[2]) {
                        clr = 'blue';
                    }
                    if (cds) {
                        coords.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [cds]
                            }
                            ,
                            fillStyle: clr,
                            txt: b.COMMUNITY_NAME,
                            tag: b.TAG,
                            cnt: b.CNT,
                            id: b.COMMUNITY_ID,
                            clng: b.C_LNG,
                            clat: b.C_LAT,
                            // s: start,
                            // e: end
                        })
                    }
                    top.push({'name': b.COMMUNITY_NAME, 'tag': b.TAG, 'cnt': b.CNT, 'lng': b.C_LNG, 'lat': b.C_LAT, 'id': b.COMMUNITY_ID, 'areaname': null})
                })
                if (coords.length > 0) {
                    var ops = {
                        draw: 'simple',//
                        globalAlpha: 0.6,
                        methods: {
                            mousemove: function (e) {
                                if (!e || e.length == 0) {
                                    $('.basemap canvas').css('cursor', 'default')
                                    $('#map-tip').css('display', 'none');
                                    return;
                                }
                                var o = e[0];
                                var c = coordtransform.wgs84tobd09(o.clng, o.clat);
                                var s = basemap.mapvw.pointToPixel(new BMap.Point(c.lng, c.lat));
                                $('#map-tip').html("<p>场景：" + o.txt + "</p><p>标签：" + o.tag + "</p><p>值：" + o.cnt + "</p>");
                                $('#map-tip').css('left', s.x + 'px');
                                $('#map-tip').css('top', s.y + 'px');
                                $('.basemap canvas').css('cursor', 'pointer');
                                $('#map-tip').css('display', 'block');
                            },
                            click: function (e) {
                                if (!e || e.length == 0) {
                                    return;
                                }
                                var o = e[0];
                                $Layer.drawSceneComplaintLayer(o.id, o.s, o.e,'0');
                            },

                        }, mcode: 'poiscene'
                    }
                    var md = new mapv.DataSet(coords);

                    var map = new mapv.baiduMapLayer(mapid, md, ops);
                    // 图例
                    var tu=(data[0].TULI).split('@');
                    var t0=tu[0].split('&');
                    var t1=tu[1].split('&');
                    var t2=tu[2].split('&');
                    var t3=tu[3].split('&');

                    Led.add({
                        m: {f: '', t: ''+secetorName+''},
                        k: 'poiscene',
                        s: [{
                            f: '#8CEA00',
                            t: '['+t0[1]+','+t0[2]+')'
                        }, {
                            f: 'blue',
                            t: '['+t1[1]+','+t1[2]+')'
                        },
                            {
                                f: 'yellow',
                                t: '['+t2[1]+','+t2[2]+')'
                            },
                            {f: 'red',
                                t: '['+t3[1]+','+t3[2]+')'
                            }
                            ,
                            // {f: 'red',
                            //     t: '['+t1[1]+','+t1[2]+']'
                            // }
                        ]
                    })
                }
                basemap.mapvw.panTo(new BMap.Point(panto.lng, panto.lat))
                $Evt.loading.off();
            },
            error: function (e) {
                $Evt.loading.off();
            }
        })
    },



    drawPoiSceneHotLayer: function () {
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/getPoiComplaint',
            data: {citycode: $param._me},
            success: function (data) {
                if (!data || data.length == 0) {
                    $Evt.loading.off();
                    return;
                }

                var coords = [];
                var coord;
                $.each(data, function (a, b) {
                    coord = coordtransform.wgs84tobd09(b.LNG, b.LAT);
                    coords.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [coord.lng, coord.lat]
                        }
                        , count: 30
                    })
                })
                if (coords.length > 0) {
                    var ops = {
                        draw: 'heatmap',//
                        size: 10,
                        gradient: {0.25: "green", 0.55: "blue", 0.85: "yellow", 1.0: "red"},
                    }
                    var md = new mapv.DataSet(coords);
                    var map = new mapv.baiduMapLayer(basemap.mapvw, md, ops);
                    basemap.mapvw.panTo(new BMap.Point(coord.lng, coord.lat))
                    $Evt.loading.off();
                }
            },
            error: function (e) {
                $Evt.loading.off();
            }
        })
    },

    drawSceneComplaintLayer: function (id,start,end,ctype) {
        $Layer.removeLayer("poicomplaint")
        var Led=new Legend();
        Led.close("poicomplaint");
        $Evt.loading.on('加载投诉点..', 30);
        $.ajax({
            type: 'post',
            url: '/userperce/UCMapv/getPoiComplaint',
            data: {citycode: $param._me, id: id,start:start,end:end,ctype:ctype},
            success: function (data) {
                if (!data || data.length == 0) {
                    $Evt.loading.off();
                    return;
                }

                var coords = [];
                var coord;
                var img = new Image();
                img.src = '../../images/map/symbols/mark_ucl_new.png';
                $.each(data, function (a, b) {
                   // var sp=b.split("_");
                    coord = coordtransform.wgs84tobd09(this.LNG, this.LAT);
                    coords.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [coord.lng, coord.lat]
                        }, icon: img
                    })
                })


                if (coords.length > 0) {
                    var ops = {
                        draw: 'icon',//
                        height: 46,
                        mcode: 'poicomplaint'
                    }
                    var md = new mapv.DataSet(coords);
                    var map = new mapv.baiduMapLayer(basemap.mapvw, md, ops);
                    Led.add({m: {f: '../../images/map/symbols/mark_ucl_new.png', t: '投诉点'}, k: 'poicomplaint'})
                }

                $Evt.loading.off();
            },
            error: function (e) {
                $Evt.loading.off();
            }
        })

    },
    /**
	 * @description 移动并标识
	 * @param [Object|Array]
	 *            point {lng,lat}
	 * @param [Object]
	 *            option
	 *            {map:默认为basemap.mapvw,coord:wgs/默认为bd,distimer:消失时间(ms)}
	 */
    panToFlag:function (point,option) {
        var map=(option&&option.map)||basemap.mapvw;
        $Layer.removeLayer("pan-flag",map)
        if(!point||point==null)
            return;
        var p;
      if($.isArray(point))
        {
            var data=[];
            $.each(point,function (a,b) {
                p=option&&option.coord&&option.coord=='wgs'?coordtransform.wgs84tobd09(b.lng,b.lat):b;
                data.push(new BMap.Point(p.lng,p.lat));
            })
            var c=MGeoLib.GeoUtils.getPolygonCenter(data);
            this.panToFlag(c,{map:map});
        }
      else if(typeof point=='object')
        {
            var img = new Image();
            img.src = '../../images/map/symbols/mark_r.png';
             p=option&&option.coord&&option.coord=='wgs'?coordtransform.wgs84tobd09(point.lng,point.lat):point;
            var md = new mapv.DataSet([
                {
                    geometry: {
                        type: 'Point',
                        coordinates: [p.lng, p.lat]
                    }, icon: img
                }
            ]);
            var v = new mapv.baiduMapLayer(map, md, {
                draw: 'icon',//
                height: 64,
                zIndex: 9999999,
                mcode: 'pan-flag'
            });
            if(p)
                map.panTo(new BMap.Point(p.lng, p.lat));
            if (option&&option.distimer) {
                var t = setInterval(function () {
                    $Layer.removeLayer("pan-flag",map)
                    clearInterval(t)
                }, (option.distimer + 500))
            };
        }
    },

    getCenterPoint:function () {

    },

    /**
	 * @description 清除轨迹点
	 * @param {String|Array}
	 *            [t]
	 * @param {String}
	 *            [x]
	 */
    clearLayer: function (t, x) {
        if (!basemap.mapvw)
            return;
        if (t == 'M') {
            lyrmgr.delMapLayerbyName(stylemap.SName.MRRSRP_UC);
            lyrmgr.delMapLayerbyName(stylemap.SName.UCSMRGRID);
            lyrmgr.delMapLayerbyType(lyrmgr.LType.TILESMAP);
            lyrmgr.delMapLayerbyType(lyrmgr.LType.USERMRGRID);
            lyrmgr.delMapLayerbyName(stylemap.SName.HOTCLUSTER);
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTERS);
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTER);
            return;
        }
        var led = new Legend();
        var lay = basemap.mapvw.getOverlays();
        if (t) {
            if (t instanceof Array) {
                $.each(t, function (i, j) {
                    $.each(lay, function (a, b) {
                        if (b._XF && b._XF.startWith(j)) {
                            b.remove();
                            delete  b._XF
                            led.close(j);
                        }
                    })
                });
                lyrmgr.delMapLayerbyName(stylemap.SName.MRRSRP_UC);
                lyrmgr.delMapLayerbyName(stylemap.SName.UCSMRGRID);
                lyrmgr.delMapLayerbyType(lyrmgr.LType.TILESMAP);
                lyrmgr.delMapLayerbyName(stylemap.SName.USERMRGRID);
                lyrmgr.delMapLayerbyName(stylemap.SName.HOTCLUSTER);
                lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTER);
                lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTERS);
                return;
            }

            var tx = t + (x || '');
            $.each(lay, function (a, b) {
                if (b._XF && b._XF.startWith(tx)) {
                    delete  b._XF
                    b.remove();
                }
            })
            led.close(t);
        }
        else {
            $.each(lay, function (a, b) {
                if (b._XF) {
                    b.remove();
                    delete  b._XF
                    led.close(b._XF.substring(0, 1));
                }
            })
            lyrmgr.delMapLayerbyName(stylemap.SName.MRRSRP_UC);
            lyrmgr.delMapLayerbyName(stylemap.SName.UCSMRGRID);
            lyrmgr.delMapLayerbyType(lyrmgr.LType.TILESMAP);
            lyrmgr.delMapLayerbyName(stylemap.SName.USERMRGRID);
            lyrmgr.delMapLayerbyName(stylemap.SName.HOTCLUSTER);
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTER);
            lyrmgr.delMapLayerbyName(stylemap.SName.MONITORCLUSTERS);
            lyrmgr.delMapLayerbyName(stylemap.SName.FLAG);
        }
    },
    /**
	 * @param {String|Array}
	 *            t
	 * @param x
	 * @return {Array}
	 */
    getLayer: function (t, x) {
        var lay = basemap.mapvw.getOverlays();
        var l = [];
        if (t) {
            if (t instanceof Array) {
                $.each(t, function (i, j) {
                    $.each(lay, function (a, b) {
                        if (b._XF && b._XF.startWith(j)) {
                            l.push(b);
                        }
                    })
                });
                return l;
            }

            var tx = t + (x || '');
            $.each(lay, function (a, b) {
                if (b._XF && b._XF.startWith(tx)) {
                    l.push(b);
                }
            })
        }
        else {
            $.each(lay, function (a, b) {
                if (b._XF)
                    l.push(b);
            })
        }
        return l;
    },
    getMapLayer: function (code,map) {
        var _map=map||basemap.mapvw;
        return mapv.getLayer(_map, code);
    },
    show: function (t) {
        if (t == 'M') {
            lyrmgr.delMapLayerbyName(stylemap.SName.UCMRGRID);
            return;
        }
        var lay = basemap.mapvw.getOverlays();
        if (t) {
            var tx = t + (x || '');
            $.each(lay, function (a, b) {
                if (b._XF && b._XF.startWith(tx)) {
                    b.show();
                }
            })
        }
        else {
            $.each(lay, function (a, b) {
                if (b._XF) {
                    b.show();
                }
            })
        }
    },
    hide: function (t) {
        if (t == 'M') {
            lyrmgr.hideMapLayer("扇区");
            return;
        }
        var lay = basemap.mapvw.getOverlays();
        if (t) {
            var tx = t + (x || '');
            $.each(lay, function (a, b) {
                if (b._XF && b._XF.startWith(tx)) {
                    b.hide();
                }
            })
        }
        else {
            $.each(lay, function (a, b) {
                if (b._XF) {
                    b.hide();
                }
            })
        }
    },
    showLayer: function (code,map) {
        var l =  $Layer.getMapLayer(code,map)
        if (l) {
            l.show();
        }
    },
    hideLayer: function (code,map) {
        var l =  $Layer.getMapLayer(code,map)
        if (l) {
            l.hide();
        }
    },
    removeLayer: function (code,map) {
        var l =  $Layer.getMapLayer(code,map)
        if (l) {
            l.remove();
        }
    },

    /**
	 * 
	 * @param {Ararr}
	 *            p
	 */
    lyeAdaption: function (pa) {
        if (!pa || pa.length == 0)
            return;
        var m = {}
        var pj = new PjComm.PjMapData(basemap.mapvw);
        pj.GetMaxMinPoint(m, pa[0].lng, pa[0].lat);
        var point = new BMap.Point(pa[0].lng, pa[0].lat);
        pa.splice(0, 1);
        if (pa) {
            $.each(pa, function (i, j) {
                if (basemap.mapvw.getDistance(point, new BMap.Point(j.lng, j.lat)) < 10000) {
                    pj.GetMaxMinPoint(m, j.lng, j.lat);
                    // pjconvert.getMaxMinPoint(m, j.lng, j.lat);
                }
            })
        }
        var c = new BMap.Point((m.MaxLng + m.MinLng) / 2, (m.MaxLat + m.MinLat) / 2);
        basemap.mapvw.setCenter(c);
        var z = pj.GetZoomInBounds(m);
        basemap.mapvw.setZoom(z < 15 ? 15 : z);
        return c;
    }
}

String.prototype.startWith=function (s) {
    var reg=new RegExp("^"+s);
    return reg.test(this);
}

var $eData = {
    set: function () {
        if (!$param._x)
            return;
        $.each($param._x, function (a, b) {
           var k=b.cr.lng+'_'+b.cr.lat;
            if (k in $param._e) {
                $param._e[k].cnt = $param._e[k].cnt + 1;
                $param._e[k].data.push(b);
            }
            else {
                $param._e[k] = {data: [b], cnt: 1}
            }
        })
    },
    distance: function (lng, lat) {
        if (!$param._e)
            return false;
        var f = false;
        $.each($param._e, function (a, b) {
            if (basemap.mapvw.getDistance(new BMap.Point(lng, lat), new BMap.Point(112.3, 23.34)) <= 10) {
                f = true;
                return false;
            }
        })
        return f;
    },
    /**
	 * @param {String}
	 *            x xdrid
	 * @return xdrdata
	 */
    get: {
        xdr: function (x) {
            if (!x)
                return $param._x;
            if (!$param._x)
                return;
            var xdr = undefined;
            $.each($param._x, function (a, b) {
                if (b.xd == x) {
                    xdr = b
                }
                return false;
            })
            return [xdr];
        },
        mark: function (k) {
            // overlay[0].ID
            var mk = undefined;
            var lay = basemap.mapvw.getOverlays();
            $.each(lay, function (a, b) {
                if (b.X_POINT && b.X_POINT == k) {
                    mk = b;
                    return false;
                }
            })
            return mk;
        }
    }
}

function swicthcell(x) {
    var n = parseInt(x, 16);
    return parseInt(n / 256) + '-' + n % 256;
}

function  getico(t) {
    switch (t) {
        case 0:
            return "../../images/map/symbols/mark_ou_x.png";
        case 1:
            return "../../images/map/symbols/mark_ucl.png";
        case 2:
            return "../../images/map/symbols/mark_xdr.png";
        case 3:
            return "../../images/map/symbols/mark_xdr_sel.png";
        case 4:
            return "../../images/map/symbols/sector-pos-3026.png";
        case 5:
            return "../../images/map/symbols/sector-ul-low3026.png";
        case 6:
            return "../../images/map/symbols/sector-ul-mid3026.png";
        case 7:
            return "../../images/map/symbols/sector-ul-high3026.png";
        case 8:
            return "../../images/map/symbols/sector-xn-3026.png";
        case 9:
            return "../../images/map/symbols/sector-tf-3026.png";
        case 10:// 上网接入异常
            return "../../images/map/symbols/mark_net_access.png";
        case 11:// 上网保持异常
            return "../../images/map/symbols/mark_net_keeper.png";
        case 12:// 视频异常
            return "../../images/map/symbols/mark_net_vedio.png";
        case 13:// 浏览异常
            return "../../images/map/symbols/mark_net_brower.png";
        case 14:// 即时消息异常
            return "../../images/map/symbols/mark_net_message.png";
        case 15:// 其他业务异常
            return "../../images/map/symbols/mark_net_other.png";
        case 16:
            return "../../images/map/symbols/sector-sel-3026.png";
        case 17:
            return "../../images/map/symbols/plansite.png";
        case 18:
            return "../../images/map/symbols/ppchange.png";
        case 19:
            return "../../images/map/symbols/sector-gw-2018.png";
    }

}

var $Evt= {
    loading: {
        /**
		 * @param {String}
		 *            message
		 * @param {Number}
		 *            [otime] second
		 */
        on: function (message, otime) {
            this.fg=false;
            var _self=this;
            var a=setTimeout(function () {
                $('.map-loading i').css({'background':'url(../../images/map/symbols/loading.gif) no-repeat','background-size': '20px 20px'});
                // $('.map-loading i').css('background',
				// 'url(../../images/map/symbols/loading.gif) no-repeat');
             // ;background-size: 20px 20px;
                $('.map-loading span').text(message);
                $('.map-loading').css('display', 'block');
                if (otime) {
                    var bt = new Date();
                    var k = setInterval(function () {
                        var t = parseInt(new Date() - bt) / 1000;
                        if (_self.fg==true) {
                            clearInterval(k);
                        }
                        else if (t >= otime && (!_self.fg)) {
                            $('.map-loading i').css({'background':'url(../../images/map/symbols/info.png) no-repeat','background-size': '20px 20px'});
                            $('.map-loading span').text("等待超时");
                            var b=setTimeout(function () {
                                _self.off();
                                _self.fg = false;
                                clearTimeout(b);
                            },5000)
                            clearInterval(k);
                        }
                    }, 200);
                }
                clearTimeout(a);
            },50)
        },
        off: function () {
            var _self=this;
            var t=setTimeout(function () {
                $('.map-loading').css('display', 'none');
                _self.fg=true;
            },100)
        }
    }
}


/**
 * @param {object}
 *            ponits :[lng,lat,address,led]
 * @param {Object}
 *            disableclk 点击地图开关 true/false
 * @type {UCMap.SelAddress}
 */
var s=UCMap.SelAddress=function (points,disableclk) {
         this.points=points;
         this.disableclk=disableclk;
}
var _rsl = {};
s.prototype.setSelAddressDom=function(selectorid,city,obj,callback) {
    $("#" + selectorid).empty();
    var html = "<div class=\"pre-deal-map\" id=\"pre-map\" >\n" +
         "<div id=\"mydrag\" style=\"height: 35px;width: 100%;background:#16354F;\" class=\"ui-draggable-handle\"><h2 style=\"color:  white;padding: 10px;font-size: 18px;float: left;\n" +
        "\">地址纠偏</h2><div id=\"closeform\" style=\"right: 2px;top: 7px;width: 20px;height: 20px;position: absolute;margin-top: 1px;font-size: 16px;\">X</div></div>"+
        " <div id=\"pmap\" style=\"position: relative;height:550px;width: 100%;top:-5px\">\n" +
        " </div>\n" +
        " <div class=\"map-tools\"style=\"margin-top: 25px;\">\n" +
        " <div class=\"map-tools-panel\">\n" +
        " <a  class=\"tools-box zoom-out\" id='zoom-out-id' ></a>\n" +
        " <a  class=\"tools-box zoom-in\" id='zoom-in-id' ></a>\n" +
        "<a  class=\"tools-box address-pos1\" id='adress-pos-id'></a>\n" +
        " </div>\n" +
        " </div>\n"+
        " <div class=\"map-status\" style='bottom: 0px;width:100%;border-bottom: 1px solid #1e4f6b!important;height: 30px;'>\n" +
        " <span>\n" +
        " <div class=\"lon-lat-label\" style='width: 175px;text-align: left;margin-top: 5px;'>0.000000  0.000000</div>\n" +
        " <div class=\"vertical-line\"></div>\n" +
        " <div class=\"zoom-class-label\" style='width: 70px;padding-top: 2px;margin-top: 5px;'>当前等级  </div>\n" +
        " <div class=\"vertical-line\" ></div>\n" +
        " <div class=\"map-status-content\" style='padding-top: 2px;text-align: left;margin-top: 5px;' >点击地图选择新地址</div>\n" +
        " </span>\n" +
        " </div>\n" +
        "<button id='m-commit' class='btn btn-link color-highlight' type=\"button\" style=\"float: left;position: absolute;right:9px;bottom: 0px;border-radius: 2px;height: 30px;padding: 2px;\" ><img src=\"../../images/img/save.png\" style=\"width:12px;margin-right: 5px;\n" +
        "\">提交</button>\n" +
        // "<button id='m-cancel' class='btn btn-link color-highlight'
		// type=\"button\" style=\"float: left;position: absolute;right:
		// -45px;top: -2px;padding: 0;\" ><img
		// src=\"../../images/img/close_window.png\"
		// style=\"width:29px;margin-right: 5px;\n" +
        // "\"></button>" +
        "</div>"
        + "<div class=\"map-address-poi\" id=\"map-address-poi-id\">\n" +
        "<div id=\"mypoidrag\"><h4 style='text-align: left;'><label  style=\"height: 28px;font-size: 18px;padding: 10px;\">地址查询</label></h4></div>\n" +
        "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" \" ></input>\n" +
        "<div class=\"line-split\" style='margin-top: 5px;' > </div>\n" +
        "<div id=\"set-address-poi-id\"  lay-filter=\"set-address-poi-id\" lay-data=\"{id: 'set-address-poi-id'}\" ></div>\n" +
        "</div>";
    $("#" + selectorid).append(html);
    $("#" + selectorid).removeAttr('style');
    $("#" + selectorid).attr('style', 'position: absolute;border-radius: 2px;z-index:33333;right: 25%;top:5%;width:1000px;height:600px;box-shadow: #0a4554 0px 0px 10px;border: 1px solid #347597;display: none');
    var _self = this;
    var map = null;
    var _k = setTimeout(function (_c, _p) {
        try {
            map = new BMap.Map('pmap', {
                minZoom: 9,
                maxZoom: 19,
                enableMapClick: false
            });
        }
        catch (e) {
            $('.map-status-content').val('加载地图失败');
            throw new Error("加载地图失败!")
        }
        map.centerAndZoom(_c||'昆明', 17);
        map.enableScrollWheelZoom();
        map.setMapStyle({style:'bluish'});
        map.disableDoubleClickZoom();
        var geoc = new BMap.Geocoder();
        var mymap = map;
        if (!_self.disableclk || _self.disableclk == false) {
            map.addEventListener('click', function (e) {
                _rsl = undefined;
                // $Layer.clearLayer('PMARK');
                // var l = mymap.getOverlays();
                // for (var i = 0; i < l.length; i++) {
                //
                // if (l[i]._XF == 'PMARK') {
                // l[i].remove();
                // }
                // }
                // var n = new BMap.Icon("../../images/map/symbols/mark_r.png",
				// new BMap.Size(25, 32));
                // var k = new BMap.Marker(e.point,
                // {
                // icon: n,
                // offset: {width: 0, height: -16},
                // enableMassClear: false,
                // enableClicking: false
                // //title: c.lng + '_' + c.lat
                // });
                // k._XF = 'PMARK';
                // mymap.addOverlay(k);
                // mymap.panTo(e.point);
                $Layer.panToFlag(e.point,{map:map})
                geoc.getLocation(e.point, function (rs) {
                    var a = rs.surroundingPois;
                    if (a.length > 0) {
                        var m = 100000;
                        var b;
                        $.each(a, function (i, j) {
                            var d = map.getDistance(e.point, j.point);
                            if (d < m) {
                                m = d;
                                b = j;
                            }
                        })
                        if (b && m < 100) {
                            _rsl = {
                                address: b.address + '(' + b.title + ')',
                                point: a[0].point,
                                property: rs.addressComponents.district
                            };
                            $('.map-status-content').text(b.title + ':' + b.address);
                        }
                    }
                    if (_rsl == undefined) {
                        _rsl = {address: rs.address, point: e.point, property: rs.addressComponents.district}
                        $('.map-status-content').text(_rsl.address);
                    }
                    // $("#m-commit").removeAttr('disabled');
                }, {poiRadius: 100});
            });
        }

        map.addEventListener('rightclick', function () {
            var a = map.getOverlays();
            $.each(a, function (i, j) {
                if (j._XF && j._XF == 'MARK')
                    j.remove();
            })
        });
        map.addEventListener('tilesloaded', showmap(map, selectorid, _p,_c))
        map.addEventListener('zoomend', function () {
            $('.zoom-class-label').text('等级:' + map.getZoom())
        })
        var lonlat = document.querySelector(".lon-lat-label");
        map.addEventListener('mousemove', function (e) {
            var c = coordtransform.bd09towgs84(e.point.lng, e.point.lat)
            lonlat.innerText = c.lng.toFixed(6) + '° ' + c.lat.toFixed(6) + '°';
        })
        clearTimeout(_k);
    }, 500, city, this.points)

    $('#m-commit').click(function () {
        if (callback && typeof callback === 'function') {
            getDistrict()
            var k = setInterval(function () {
                if (!_rsl || _rsl.property) {
                    callback(_rsl);
                    $("#" + selectorid).css('display', 'none');
                    $("#" + selectorid).empty();
                    clearInterval(k)
                }
            }, 500)
        }
    })
    $('#closeform').click(function () {
        _rsl = {};
        $("#" + selectorid).css('display', 'none');
        $("#" + selectorid).empty();
    })
    $("#zoom-out-id").click(function () {
        map.zoomIn();
    })
    $("#zoom-in-id").click(function () {
        map.zoomOut();
    })

    $('.map-status-content').on('DOMNodeInserted', function () {
        $("#m-commit").removeAttr('disabled');
    })


    // junwei 热线助手地图点击事件--区域选择
    $("#maps").on("click", "#clickArea", function (e) {
        layui.stope(e)
        map.clearOverlays();
        var areaId = $(this).attr("areaId");
        var lng = $(this).attr("lng");
        var lat = $(this).attr("lat");
        var raidus = $(this).attr("raius") * 1000;
        var point = coordtransform.wgs84tobd09(lng, lat);
        var centerPoint = new BMap.Point(point.lng, point.lat);
        map.panTo(centerPoint);
        var circle = new BMap.Circle(centerPoint, raidus, {
            strokeColor: "blue",
            fillColor: "blue",
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillOpacity: 0.2
        });
        map.addOverlay(circle);
    })


    var a = 0;
    $("#maps").on("click", "#commitArea", function () {
        if (a == 0) {
            var val = $('input:radio[name="area"]:checked');
            if (val.val() == null && a == 0) {
                msg("请选择一个区域")
                return false;
            }
            else {
                var areaId = val.attr("areaId");
                var areaDistrict = val.attr("areaDistrict");
                // console.log("areaId:"+areaId+"areaDistrict:"+areaDistrict)
                _rsl = {areaId: areaId, areaDistrict: areaDistrict}
                if (callback && typeof callback === 'function') {
                    callback(_rsl);
                }
                $("#" + selectorid).css('display', 'none');
                $("#" + selectorid).empty();
                $(".layui-form-label").css("width","100px");
                $(".layui-input-block").css("margin-left","100px");
                $('html,body').animate({scrollTop: $('.bottom').offset().top}, 200);

            }
            a++;
        }
    });

    var b = 0;
    $("#maps").on("click", "#reset", function () {
        if (b == 0) {
            b++;
            a++;
            $("#" + selectorid).css('display', 'none');
            $("#" + selectorid).empty();
            $('html,body').animate({scrollTop: $('.bottom').offset().top}, 200);
            $(".layui-form-label").css("width","100px");
            $(".layui-input-block").css("margin-left","100px");
        }
    })
// 热线助手
    $("#adress-pos-id").click(function () {
        $("#map-position-id").remove();
        $("#" + selectorid).append("<div class=\"map-position\" id=\"map-position-id\" style='display: block;width:320px;left: 35%;background: #16354F;color: #ffffff;'>\n" +
            "<H4><label class=\"p-label\" id=\"p-label-id\" style=\"height: 20px;margin-left:5px;font-size: 14px;margin-top: 6px;font-weight: 100;\">地址查找</label></H4>\n" +
            "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" />\n" +
            " <div class=\"line-split\" style='margin-top: -5px;' > </div>\n" +
            "<div class=\"p-content\">\n" +
            "<label class=\"p-content-label\" style='font-size: 13px;'>地址 </label>\n" +
            "<input class=\"p-content-text layui-input\"style='display: initial;height: 34px;width: 250px;' focusplaceholder=\"输入地址\" type='text' value=\"\" ></input>\n" +
            "</div>\n" +
            "<div class=\"p-content\" style=\"margin-top:5px;margin-bottom: 5px;\">\n" +
            "<input class=\"p-content-ok\"  type=\"button\"  style='margin-top: 5px;' value=\"定位\"></input>\n" +
            "</div>\n" +
            "</div>");
        $('.p-content-text').val(_self.points?_self.points[_self.points.length-1].address:'');
        $(".p-content-ok").click(function () {
            var info = $(".p-content-text").val();
            var p = search(city, info, map, _rsl);
            if (p) {
                // $("#map-position-id").fadeOut(200);
                // $("#map-address-poi-id").fadeOut(200);

                $(".map-position").fadeOut(200);
            }
        })

        $(".p-content-cancel").click(function () {
            $("#map-address-poi-id").fadeOut(200);
            $("#map-position-id").fadeOut(200);
            $(".map-position").fadeOut(200);
        })
    })

    $(".p-content-cancel").click(function () {
        $("#map-address-poi-id").fadeOut(200);
        $("#map-position-id").fadeOut(200);
        $(".map-position").fadeOut(200);
    })

    var couter = 0;
    var timer = setInterval(function () {
        if (map) {
            var c1 = 0
            if (obj != null) {
                if (c1 == 0) {
                    c1++;
                    var radius = obj.radius*1000;// 转化为米
                   var point = coordtransform.wgs84tobd09(obj.lng, obj.lat);
                    var centerPoint = new BMap.Point(point.lng,point.lat);
                    var circle = new BMap.Circle(centerPoint, radius, {
                        strokeColor: "blue",
                        fillColor: "blue",
                        strokeWeight: 2,
                        strokeOpacity: 0.5,
                        fillOpacity: 0.2
                    });
                map.addOverlay(circle);
                }
            }
            clearInterval(timer);
        }
        couter++;
        if (couter > 100) {
            clearInterval(timer);
        }
    }, 100)

    // 加载初始圆
    commdiv.$addMoveTip('放大一级', '#zoom-out-id', 3);
    commdiv.$addMoveTip('缩小一级', '#zoom-in-id', 3);
    commdiv.$addMoveTip('右键清除定位点', '#zoom-out-id', 3);
    commdiv.$setDragDiv('maps', 'mydrag');

}

function search(city,info,_map) {
    var ls = new BMap.LocalSearch(city||_map);
    ls.clearResults();
    ls.search(info);
    ls.enableAutoViewport();
    ls.setSearchCompleteCallback(function (rs) {
        if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
           addresspoi(rs,_map,_rsl);
            $("#map-position-id").fadeOut(200);
        }
        else {
            msg("无法查询该地址.");
        }
    });
}

function  getDistrict() {
    if (_rsl == null||!_rsl.point)
        return;
    var geoc = new BMap.Geocoder();
    geoc.getLocation(new BMap.Point(_rsl.point.lng,_rsl.point.lat), function (rs) {
        if (rs && rs.addressComponents) {
            _rsl.property = rs.addressComponents.district;
        }
    });
}

function addresspoi(rs,_map) {
    // $("#address-info-id").empty();
    var datas = [];
    var rsl = rs.getCurrentNumPois();
    for (var p = 0; p < rsl; p++) {
        var poi = rs.getPoi(p);
        datas.push({name:poi.title, ads:poi.address, point:poi.point.lng + ',' + poi.point.lat})
    }
    var header = [
        {'field': 'name', 'title': '名称', 'width': '200',style: 'cursor: pointer;color:#85EFFF;'},
        {'field': 'ads', 'width': '300','title': '地址'}
    ]
    commdiv.$worker({elem:'set-address-poi-id',fields:header,data:datas,clkevt:{idx:0,name:'clkname',cbfun:function (rsl) {
       // setMarkPOI(rsl.point,_map);
         var sp=rsl.point.split(',');
         if(sp.length==2) {
             $Layer.panToFlag({lng: sp[0], lat: sp[1]}, {map: _map});
         }
        _rsl={address: rsl.name+'('+rsl.ads+')', point: {lng:sp[0],lat:sp[1]}};
        $('.map-status-content').text(rsl.ads+'('+rsl.name+')');
    }},height:355,width:600,skin:'line'})
    $('#set-address-poi-id').next().css('margin','0px 5px')
    $("#map-address-poi-id").css('display', 'block');
    commdiv.$setDragDiv('map-address-poi-id','mypoidrag');
}

function setMarkPOI(e,_map) {
    var l = _map.getOverlays();
    for (var i = 0; i < l.length; i++) {

        if (l[i]._XF == 'MARK') {
            l[i].remove();
        }
    }
    var target=e.target?e.target.innerText.split(','):e.split(',');
    if (target.length == 2) {
        var coord = coordtransform.wgs84tobd09(target[0], target[1]);
        var n = new BMap.Icon("../../images/map/symbols/mark_r.png", new BMap.Size(25, 32));
        var k = new BMap.Marker(new BMap.Point(coord.lng, coord.lat),
            {
                icon: n,
                offset: {width: 0, height: -16},
                enableMassClear: false,
                enableClicking: false
                // title: c.lng + '_' + c.lat
            });
        k._XF = 'MARK';
        _map.addOverlay(k);
        _map.panTo(new BMap.Point(coord.lng, coord.lat));
    }
}

function  showmap(map,selid,points,city) {
    map.removeEventListener('tilesloaded', this);
    $("#" + selid).css('display', 'block');
    var L = new Legend();
    L.init(selid);
    var m = ["mark_ucl_no", "mark_ucl"];
    if (points && points.length > 0) {
        var _t = setTimeout(function () {
            var g = [];
            for (var a = 0; a < points.length; a++) {
                var b = points[a];
                if(!b.lng||b.lng==''||b.lng==0||!b.lat||b.lat==''||b.lat==0)
                    continue;
                var c = coordtransform.wgs84tobd09(b.lng, b.lat);
                var t = new BMap.Point(c.lng, c.lat);
                var n = new BMap.Icon("../../images/map/symbols/" + m[a] + ".png", new BMap.Size(32, 42));
                var k = new BMap.Marker(t,
                    {
                        icon: n,
                        offset: {width: 0, height: -21},
                        enableMassClear: false,
                        enableClicking: false
                    });
                if (b.address) {
                    k.setLabel(new BMap.Label(b.address, {offset: new BMap.Size(30, -10), enableMassClear: false}));
                }
                k._XF = 'L' + a;
                map.addOverlay(k);
                g.push(c);
                L.add({m: {f: "../../images/map/symbols/" + m[a] + ".png", t: b.led}, k: 'L' + a});
            }
            if (g.length > 1) {
                var p = new BMap.Polyline([new BMap.Point(g[0].lng, g[0].lat), new BMap.Point(g[1].lng, g[1].lat)], {
                    strokeColor: 'blue',// silver
                    strokeWeight: '2',
                    strokeOpacity: '1',
                    strokeStyle: 'dashed',
                    enableMassClear: false,
                    enableClicking: false
                });
                map.addOverlay(p);
                var d = points[0].dis || map.getDistance(new BMap.Point(g[0].lng, g[0].lat), new BMap.Point(g[1].lng, g[1].lat)) / 100;
                var l = new BMap.Label(d.toFixed(3) + 'km', {
                    offset: new BMap.Size(10, -5),
                    position: new BMap.Point((g[0].lng + g[1].lng) / 2, (g[0].lat + g[1].lat) / 2),
                    enableMassClear: false
                })
                map.addOverlay(l);
            }
            //
            if(points[0].isPos&&points[0].isPos==true) {
                search(city, points[0].address, map);
            }
            if(g.length>0)
            map.panTo(new BMap.Point(g[0].lng, g[0].lat));
            var _k = setTimeout(function () {
                $('.BMapLabel').css('position', 'relative');
                clearTimeout(_k);
            }, 100);
            clearTimeout(_t);
        }, 500)
    }
}

/**
 * @desc 浮层指标
 * @param {Array}
 *            data
 */
function setXdrPara(data) {
    if ($('.c-xdr').length == 0) {
        $('#' + basemap.VMapCfg.mapSelector).append(' <div id="xdr" class="c-xdr">\n' +
            '<input class="c-xdr-b" type="button" value="×" title="关闭" onclick="">\n' +
            '<div class="c-xdr-h" ><h4>信令详情</h4></div>\n' +
            '<div class="c-xdr-m" >\n' +
            '     <span><i>接入类型：</i><i>EUTRAN</i></span>\n' +
            '     <span><i>IMSI：</i><i>123456788883321</i></span>\n' +
            '     <span><i>手机号：</i><i>13977285831</i></span>\n' +
            '     <span><i>用户ip：</i><i>221.12.203.1</i></span>\n' +
            '     <span><i>sgw_ip：</i><i>221.7.243.6</i></span>\n' +
            '     <span><i>sgw端口：</i><i>1493</i></span>\n' +
            '     <span><i>手机终端：</i><i>VIVO-9X</i></span>\n' +
            '</div>\n' +
            '<div class="c-xdr-d" >\n' +
            '     <span><i>失败原因：</i><i class="c-xdr-f">超时内没有响应</i></span>\n' +
            '     <span><i>接口类型：</i><i>S1-U</i></span>\n' +
            '     <span><i>开始时间：</i><i>20180123 12:02:33.721</i></span>\n' +
            '     <span><i>结束时间：</i><i>20180123 12:02:34.156</i></span>\n' +
            '     <span><i>小区名：</i><i>630143-3</i></span>\n' +
            '     <span><i>eNB-IP：</i><i>221.17.213.5</i></span>\n' +
            '     <span><i>eNB端口：</i><i>1363</i></span>\n' +
            '     <span><i>业务分类：</i><i>导航</i></span>\n' +
            '     <span><i>业务小类：</i><i>百度地图</i></span>\n' +
            '     <span><i>传输协议：</i><i>TCP</i></span>\n' +
            '     <span><i>上行流量：</i><i>263</i></span>\n' +
            '     <span><i>下行流量：</i><i>128</i></span>\n' +
            '     <span><i>发送数据包量：</i><i>5</i></span>\n' +
            '     <span><i>接收数据包量：</i><i>5</i></span>\n' +
            '     <span><i>更多：</i><i>...</i></span>\n' +
            '</div>\n' +
            '</div>')
    }
    // 设置主参数

    // 设计次参数

}

var d=UCMap.DrawAutoCircle=function () {
    this.status = false;
    this.rsl=null;
    this.drawMk=function  (point) {

        var self=this;
        if(self.map==null)
            return;
        var centerPoint = new BMap.Point(point.lng, point.lat),
            borderPoint = new BMap.Point(point.lng + 0.005, point.lat);
        var radius=500;
        console.log("aaaaaaaa");
        if(point.radius!=undefined && point.radius!=null ){
           radius=point.radius*1000;// 转化米
            var rad=radius/100000;
            borderPoint = new BMap.Point(point.lng + parseFloat(rad), point.lat);
        }
        var circle = new BMap.Circle(centerPoint, radius, {
            strokeColor: "blue",
            fillColor: "blue",
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillOpacity: 0.2
        });
        self.map.addOverlay(circle);
        var marker = new BMap.Marker(centerPoint);
        self.map.addOverlay(marker);
        marker = new BMap.Marker(borderPoint, {
            enableDragging: true
        });
        self.map.addOverlay(marker);
        marker.setLabel(new BMap.Label(Math.ceil(circle.getRadius()), {
            offset: new BMap.Size(20, 0)
        }));
        marker.center = centerPoint;

        self.rsl={point:coordtransform.bd09towgs84(centerPoint.lng,centerPoint.lat),radio:500};

        marker.circle = circle;
        marker.addEventListener("dragging", function (e) {
           // var distance =
			// Math.ceil(getDistinct(this.point.lng,this.point.lat,
			// this.center.lng,this.center.lat));
            var distance =self.map.getDistance(new BMap.Point(this.point.lng,this.point.lat),new BMap.Point(this.center.lng,this.center.lat))
           // console.log(getDistinct(this.point.lng,this.point.lat,
			// this.center.lng,this.center.lat))
            this.getLabel().setContent(distance.toFixed(0)+'m');
            this.circle.setRadius(distance);
            self.rsl={point:coordtransform.bd09towgs84(centerPoint.lng,centerPoint.lat),radio:distance}
        });
    }
}

// 画圆
d.prototype.addDrawCircleMap=function (seletorid,city,obj,callback) {
    $("#" + seletorid).empty();
    var html = " <div class=\"mapvw\" id=\"mapid\" >\n" +
        " <div id=\"pmap\" style=\"position: absolute;height:550px;width: 100%;top:0px\">\n" +
        " </div>\n" +
        " <div class=\"map-tools\"style=\"top:15px\">\n" +
        " <div class=\"map-tools-panel\">\n" +
        " <a  class=\"tools-box zoom-out\" id='zoom-out-id' ></a>\n" +
        " <a  class=\"tools-box zoom-in\" id='zoom-in-id' ></a>\n" +
        "<a  class=\"tools-box querymap\" id='adress-pos-id'></a>\n" +
        "<a  class=\"tools-box grid-pos\"  id='point-id'></a>\n" +
        "<a  class=\"tools-box clearlayer\" id='clear-id'></a>\n" +
        "<a  class=\"tools-box lnglat-pos\" id='drawcircle-id'></a>\n" +
        " </div>\n" +
        " </div>\n" +
        " <button id='m-commit' type=\"button\"  style=\"float: left;position: absolute;right:80px;bottom: 5px;padding: 4px 11px;color: #ffffff;background: #16344E;border-radius: 2px;border: 1px solid #16344E;cursor: pointer;\" >提交</button>\n" +
        " <button id='m-cancel' type=\"button\" style=\"float: left;position: absolute;right: 20px;bottom: 5px;padding: 4px 11px;color: #ffffff;background: #16344E;border-radius: 2px;border: 1px solid #16344E;cursor: pointer;\" >取消</button>\n" + "</div>\n"+

        + "<div class=\"map-address-poi\" id=\"map-address-poi-id\">\n" +
        "<h4 style='text-align: left'><label  style=\"height: 28px;font-size: 18px;padding: 10px;\">地址查询</label></h4>\n" +
        "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" \" ></input>\n" +
        "<div class=\"line-split\" style='margin-top: 5px;' > </div>\n" +
        "<div id=\"set-address-poi-id\"  lay-filter=\"set-address-poi-id\" lay-data=\"{id: 'set-address-poi-id'}\" ></div>\n"

    $("#" + seletorid).append(html);
    $("#" + seletorid).removeAttr('style');
    $("#" + seletorid).attr('style','position: absolute;overflow: hidden;z-index:33333;right: 25%;top:5%;width: 900px;height:600px;box-shadow: #0a4554 0px 0px 10px;border: 1px solid #1e4f6b;display: block;');

    var _this=this;
   // $("#maps").css('display','');
   $(".map-address-poi").css("right",'0px');

    $('#m-commit').click(function () {
        if(callback&&typeof callback==='function') {
            layer.confirm('是否提交该区域', {
                btn: ['确认','取消'] // 按钮
            }, function(){
                callback(_this.rsl);
                // $("#" + seletorid).css('display','none');
                // $("#" + seletorid).empty();
                layer.closeAll();
            }, function(){
                _this.map.clearOverlays();
            });
        }

    })
    $('#m-cancel').click(function () {
        _this.rsl=null;
        $("#" + seletorid).css('display','none');
        $("#" + seletorid).empty();
    })
    $("#zoom-out-id").click(function () {
        _this.map.zoomIn();
    })
    $("#zoom-in-id").click(function () {
        _this.map.zoomOut();
    })
    $('#clear-id').click(function () {
        if(_this.map!=null)
        _this.map.clearOverlays();
        $('m-commit').attr("disabled","disabled")
        _this.rsl=null;
    })

    $('#point-id').click(function () {
       // $(".p-content").css("display",'block');
        $("#map-position-poi-id").remove();
        $("#" + seletorid).append("<div class=\"map-position\" id=\"map-position-poi-id\" style='display: block;left: 35%;background: #16354F;color: #ffffff;'>\n" +
            "<H4 style='height: 31px;'><label class=\"p-label\" id=\"p-label-id\" style=\"height: 20px;margin-left:5px;font-size: 14px;margin-top: 6px;font-weight: 100;\">经纬度查找</label></H4>\n" +
            "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" />\n" +
            " <div class=\"line-split\" style='margin-top: -5px;' > </div>\n" +
            "<div class=\"p-content\">\n" +
            "<label class=\"p-content-label\" style='font-size: 13px;'>地址 </label>\n" +
            "<input class=\"p-content-text layui-input\" style='display: initial;height: 34px;' focusplaceholder=\"输入经纬度\" type='text' value=\"\" ></input>\n" +
            "</div>\n" +
            "<div class=\"p-content\" style=\"margin-top:5px;margin-bottom: 5px;\">\n" +
            "<input class=\"p-content-ok\"  type=\"button\"  style='margin-top: 5px;' value=\"定位\"></input>\n" +
            "</div>\n" +
            "</div>");
        // jun
        $(".p-content-ok").click(function () {
            var info=$(".p-content-text").val();
            var p=searchByPoint(info,_this.map)
            // if(p) {
            $(".map-position").fadeOut(200);

            // }
        })
        $(".p-content-cancel").click(function () {
            $(".map-position").fadeOut(200);
        })

    })

    $('.p-content-ok').click(function (e) {
        var info = $(".p-content-text").val();
        var p = search(city, info, _this.map, _rsl);
        if (p) {
            $("#map-position-id").fadeOut(200);
            $(".map-position").fadeOut(200);
        }
    })


    $('#drawcircle-id').click(function () {
        $('#clear-id').click();
        _this.status=!_this.status;
        if(_this.status==true) {
            commdiv.$addMoveTip('关闭画圆', '#drawcircle-id', 3);
        }
        else {
            commdiv.$addMoveTip('开启画圆', '#drawcircle-id', 3);
            $('m-commit').attr("disabled","disabled")
            _this.rsl=null;
        }
    })
    // 投诉口径管理
    $("#adress-pos-id").click(function () {
        $("#map-position-id").remove();
        $("#" + seletorid).append("<div class=\"map-position\" id=\"map-position-id\" style='display: block;left: 35%;background: #16354F;color: #ffffff;'>\n" +
            "<H4 style='height: 31px;'><label class=\"p-label\" id=\"p-label-id\" style=\"height: 20px;margin-left:5px;font-size: 14px;margin-top: 6px;font-weight: 100;\">地址查找</label></H4>\n" +
            "<input class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" />\n" +
            " <div class=\"line-split\" style='margin-top: -5px;' > </div>\n" +
            "<div class=\"p-content\">\n" +
            "<label class=\"p-content-label\" style='font-size: 13px;'>地址 </label>\n" +
            "<input class=\"p-content-text layui-input\" style='display: initial;height: 34px;' focusplaceholder=\"输入地址\" type='text' value=\"\" ></input>\n" +
            "</div>\n" +
            "<div class=\"p-content\" style=\"margin-top:5px;margin-bottom: 5px;\">\n" +
            "<input class=\"p-content-ok\"  type=\"button\"  style='margin-top: 5px;' value=\"定位\"></input>\n" +
            "</div>\n" +
            "</div>");
        // jun
        $(".p-content-ok").click(function () {
            var info=$(".p-content-text").val();
            var p= search(city,info,_this.map);
            if(p) {
                $(".map-position").fadeOut(200);
            }
        })
    });
    $(".p-content-cancel").click(function () {

        $("#map-position-id").fadeOut(200);
        $(".map-position").fadeOut(200);
    })

    commdiv.$addMoveTip('放大一级','#zoom-out-id',3);
    commdiv.$addMoveTip('缩小一级','#zoom-in-id',3);
    commdiv.$addMoveTip('查询地址','#adress-pos-id',3);
    commdiv.$addMoveTip('清除图层','#clear-id',3);
    commdiv.$addMoveTip('经纬度定位','#point-id',3);
    commdiv.$addMoveTip('开启画圆','#drawcircle-id',3);
    try {
        this.map = new BMap.Map('pmap', {
            minZoom: 11,
            maxZoom: 19,
            enableMapClick: false
        });
    }
    catch (e) {
        throw new Error("加载地图失败!")
    }
    this.map.setMapStyle({style:'bluish'});
    this.map.enableScrollWheelZoom();
    this.map.disableDoubleClickZoom();
    if(obj==null) {
        _this.map.centerAndZoom(city, 16);
    }
    var t1=true;

    if(obj!=null) {
        if (t1) {
            t1 = false;
            var point = coordtransform.wgs84tobd09(parseFloat(obj.lng), parseFloat(obj.lat));
             point = {lng: point.lng, lat: point.lat, radius: parseFloat(obj.radius)};
            // _this.map.clearOverlays();
            $('#clear-id').click();
            // _this.status=!_this.status;
            _this.drawMk(point);
            _this.map.centerAndZoom(new BMap.Point(point.lng, point.lat), 13);
        }
    }
    this.map.addEventListener('click', function (e) {
        if( _this.status == true) {
            $("#m-commit").removeAttr('disabled');
            _this.map.clearOverlays();
            _this.drawMk(e.point);
        }
    })
}

function  searchByPoint(info,map) {
    var lnglat = info.split(',');
    if (lnglat.length != 2) {
        return msg("经纬度格式错误.");
    }
    var reglng = /^(((\d|[1-9]\d|1[0-7]\d|0)\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/;
    var reglat = /^([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/;
    if (!reglat.test(lnglat[1]) || !reglng.test(lnglat[0])) {
        return  msg("经/纬度值错误,小数应该6位内.");
    }
    var rp = setMarkPOI(lnglat[0]+","+ lnglat[1],map);
    // if (!rp) {
    // return msg("无法找到经纬度.");
    // }
    map.panTo(new BMap.Point(lnglat[0],lnglat[1]));
}


// POI场景地图
var p=UCMap.Poi=function (id,option) {
    this._option = option;
    $("#" + id).empty();
    var html = " <div class=\"poimap\" id=\"mapid\" style='height: 100%;' ></div>" +
        " <div class=\"map-tools\"style=\"top:15px\">\n" +
        " <div class=\"map-tools-panel\">\n" +
        " <a  class=\"tools-box zoom-out\" id='zoom-out-id' ></a>\n" +
        " <a  class=\"tools-box zoom-in\" id='zoom-in-id' ></a>\n" +
        // "<a class=\"tools-box querymap\" id='adress-pos-id'></a>\n" +
        // "<a class=\"tools-box clearlayer\" id='clear-id'></a>\n" +
        // "<a class=\"tools-box lnglat-pos\" id='drawcircle-id'></a>\n" +
        "<a  class=\"tools-box newarea\" id='newarea-id' style='background-repeat: no-repeat;background-size:26px 26px;' ></a>\n" +
        " </div>\n" +
        " </div>\n"
        + "<div class=\"map-address-poi\" id=\"map-address-poi-id\">\n" +
        "<h4 style='text-align: left'><label  style=\"height: 28px;font-size: 18px;padding: 10px;\">地址查询</label></h4>\n" +
        "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" \" ></input>\n" +
        "<div class=\"line-split\" style='margin-top: 5px;'> </div>\n" +
        "<div id=\"set-address-poi-id\"  lay-filter=\"set-address-poi-id\" lay-data=\"{id: 'set-address-poi-id'}\"></div>" +
        "</div>"
//        "<div style='top: 15px;position: absolute;margin-left: 117px;opacity: 0.85;'><select id='cityselect' class='form-control'><option value='102.712251x25.040609' selected='selected'>昆明</option><option value='103.797851x25.501557'>曲靖</option><option value='102.543907x24.350461'>玉溪</option>" +
//        "<option value='99.167133x25.111802'>保山</option><option value='103.717216x27.336999'>昭通</option><option value='100.233026x26.872108'>丽江</option><option value='100.972344x22.777321'>普洱</option>" +
//        "<option value='100.08697x23.886567'>临沧</option><option value='101.54615x25.0329'>楚雄</option><option value='104.244277x23.369216'>文山</option><option value='100.797941x22.001724'>版纳</option>" +
//        "<option value='100.22998x25.59157'>大理</option><option value='97.85183x24.01277'>德宏</option><option value='98.854304x25.850949'>怒江</option><option value='99.70601x27.82308'>迪庆</option>" +
//        "<option value='103.38214x23.3699'>红河</option></select></div>" +
//        "<div><input type='text' id='searchpoi' placeholder='场景名' style='position:absolute;width:30px;height:20px;margin-left:140px'>" +
//        "<button class='layui-btn'><img src=''></button></div>"


    $("#" + id).append(html);

    $('#newarea-id').css('background-image', 'url(../../images/map/tools/draw-start.png)');
    // $('#newarea-id').hover(function () {
    // $(this).css('background-image',
	// 'url(../../images/map/tools/draw-starting.png) ');
    // }, function () {
    // $(this).css('background-image',
	// 'url(../../images/map/tools/draw-start.png) ');
    // })
    try {
        this.map = new BMap.Map('mapid', {
            minZoom: 11,
            maxZoom: 19,
            enableMapClick: false
        });
    }
    catch (e) {
        throw new Error("加载地图失败!")
    }
    this.map.centerAndZoom((this._option && this._option.city) || '昆明', 16);

    this.map.addEventListener('tilesloaded', loadover)
    this.map.disableDoubleClickZoom();
    this.map.setMapStyle({style:'bluish'});
    this.map.enableScrollWheelZoom();
    var _this = this;
    var geo;
    // 事件注册
    $("#zoom-out-id").click(function () {
        _this.map.zoomIn();
    })
    $("#zoom-in-id").click(function () {
        _this.map.zoomOut();
    })
    $('#newarea-id').click(function () {
        if (geo != null) {
            $('#newarea-id').css('background-image', 'url(../../images/map/tools/draw-start.png)');
            commdiv.$addMoveTip('新增区域', '#newarea-id', 3);
            geo.close();
            geo=null;
        }
       else {
            $('#newarea-id').css('background-image', 'url(../../images/map/tools/draw-starting.png)');
            commdiv.$addMoveTip('关闭绘制', '#newarea-id', 3);
            geo = new geoTools.Draw(_this.map, {
                edit: true,
                compelete: function (rsl) {
                    if (option.drawover && typeof option.drawover == 'function') {
                        option.drawover(rsl)
                    }
                    $('#newarea-id').css('background-image', 'url(../../images/map/tools/draw-start.png)');
                    commdiv.$addMoveTip('新增区域', '#newarea-id', 3);
                    geo=null;
                },
                close: function () {
                    // $('#newarea-id').css('pointer-events', '')
                   // $('#newarea-id').css('background-image',
					// 'url(../../images/map/tools/draw-start.png) ');
                }
            });
            geo.open();
            // $(this).css('pointer-events', 'none');

        }
    })

    $('#cityselect').change(function () {
        var v=$('#cityselect').val().split('x');
        if(_this.map&&v.length==2)
        {
            _this.map.panTo(new BMap.Point(v[0],v[1]));
        }
    })

    if(this._option.events)
    {
        var i=0;
        for(;i<this._option.events.length;i++)
        {
            var one=this._option.events[i];
            this.map.addEventListener(one.key, function (e) {
                if(one.function&&typeof one.function=='function')
                {
                    one.function(e);
                }
            })
        }

    }

    function loadover() {
        this.removeEventListener('tilesloaded', loadover)
        if (option && option.compelete && typeof option.compelete == 'function') {
            option.compelete();
        }
    }
    waitjs('commdiv',function () {
        commdiv.$addMoveTip('放大一级', '#zoom-out-id', 3);
        commdiv.$addMoveTip('缩小一级', '#zoom-in-id', 3);
        commdiv.$addMoveTip('新增区域', '#newarea-id', 3);
    })
    $('#cityselect').change();
    return this;
}

// data 场景名，场景ID，标签，坐标列表
p.prototype.loadbase=function (data,callback) {
    if (!data)
        return;
    // $Evt.loading.on('正在加载底图..',120);
    $Layer.removeLayer('basepoi')
    var Led = new Legend();
    Led.close('basepoi');
    var coord = null;
    var coords=[];
    var temp=[],tmp=[];
    $.each(data, function (a, b) {
        var cds = [];
        if (b.LOCATIONS) {
            temp = b.LOCATIONS.split(";");
            $.each(temp, function (c, d) {
                tmp = d.split(",");
                coord = coordtransform.wgs84tobd09(tmp[0], tmp[1]);
                cds.push([coord.lng, coord.lat])
            })
        }
        if (cds.length>2) {
            if(cds[0][0]==cds[cds.length-1][0]&&cds[0][1]==cds[cds.length-1][1])
            {
                cds.splice(-1,1);
            }
            coords.push({
                geometry: {
                    type: 'Polygon',
                    coordinates: [cds]
                }
                ,
                fillStyle: 'green',
                txt: b.COMMUNITY_NAME,
                tag: b.TAG,
                id: b.COMMUNITY_ID,
                center: b.CENTERS,
                area:b.ACREAGE,
                city:b.CITY,
                district:b.DISTRICT
            })
        }

    })
    if (coords.length > 0) {
        var ops = {
            draw: 'simple',//
            globalAlpha: 0.6,
            mcode: 'basepoi',
            methods:{
                dbclick:function (e) {
                    if(e.length==0)
                        return;
                    if(callback&&typeof callback=='function')
                    {
                        callback(e[0]);
                    }
                }
            }
        }

        var md = new mapv.DataSet(coords);
        var map = new mapv.baiduMapLayer(this.map, md, ops);
        // 图例
        Led.add({
            m: {f: 'green', t: '场景图'},
            k: 'basepoi'
        })
    }

}

p.prototype.loadcluster=function(data) {
    if (!data && data.length == 0)
        return;
    $Layer.removeLayer('drawpoicluster');
    $Layer.removeLayer('drawpoigrid');
    var clu_coords = [];
    var temp = [], tmp = [];
    var coord = null;
    var grid_coords = [];
    $.each(data, function (a, b) {
        var cds = [];
        if (b.LOCATIONS) {
            temp = b.LOCATIONS.split(";");
            $.each(temp, function (c, d) {
                tmp = d.split(",");
                coord = coordtransform.wgs84tobd09(tmp[0], tmp[1]);

                cds.push([coord.lng, coord.lat])

            })
        }

        if (cds.length > 2) {
            if (b.COMMUNITY_ID.startWith('CLUSETER')) {
                var k = cds.slice(0, 1);
                cds.push(k[0])
                clu_coords.push({
                    geometry: {
                        type: 'LineString',
                        coordinates: cds
                    }
                })
            }
            else if (b.COMMUNITY_ID.startWith('GRID')) {
                grid_coords.push({
                    geometry: {
                        type: 'LineString',
                        coordinates: cds
                    }
                })
            }
        }
    })

    if (clu_coords.length > 0) {
        var cops = {
            strokeStyle: 'red',
            lineWidth: 2,
            mcode: 'drawpoicluster',
            lineDash: [10, 2]
        }
        var cmd = new mapv.DataSet(clu_coords);
        var map0 = new mapv.baiduMapLayer(this.map, cmd, cops);
    }

    if (grid_coords.length > 0) {
        var cops = {
            strokeStyle: 'black',
            lineWidth: 2,
            mcode: 'drawpoigrid',
        }
        var cmd = new mapv.DataSet(grid_coords);
        var map0 = new mapv.baiduMapLayer(this.map, cmd, cops);
    }
}

 p.prototype.loaddraw=function (data) {
     if (!data&&data.length==0)
         return;
     $Layer.removeLayer('drawpoi')
     var Led = new Legend();
     Led.close('drawpoi');
     var coord = null;
     var _this=this;
     var tmp=[];
     var temp=[];
     $.each(data, function (a, b) {
         var cds = [];
         if (b.LOCATIONS) {
             temp = b.LOCATIONS.split(';');
             $.each(temp, function (x, y) {
                 tmp = y.split(',');
                 coord = coordtransform.wgs84tobd09(tmp[0], tmp[1]);
                 cds.push(new BMap.Point(coord.lng, coord.lat));
             })
         }
         if (cds.length>0) {
             var ploy = new BMap.Polygon(cds, {
                 fillColor: 'blue',
                 strokeColor: 'blue',
                 strokeWeight: 2,
                 fillOpacity: 0.6,
                 strokeStyle: 'solid',// 或dashed
                 enableMassClear: false,
                 enableEditing: false,
                 enableClicking: false

             })
             ploy.GEO_SN = b.COMMUNITY_ID;
             // ploy.addEventListener('click',function (e) {
             //
             // })
             _this.map.addOverlay(ploy);
         }
     })
     Led.add({
         m: {f: 'blue', t: '场景图'},
         k: 'drawpoi'
     })
 }
 
 p.prototype.updatedraw=function (key) {
     var poly;
     var overlay=this.map.getOverlays();
     if(overlay)
     {
         $.each(overlay,function (a,b) {
             if(b.GEO_SN==key)
             {
                 poly=this;
                 return false;
             }
         })
     }
     if(poly) {
         poly.setFillColor('green');
         poly.setStrokeColor('transparent');
         poly.setFillOpacity(0.6);
         poly.setStrokeOpacity(0);
     }
 }
 
 p.prototype.dellay=function (sn,key) {
     var overlay=this.map.getOverlays();
     if(overlay) {
         $.each(overlay, function (a, b) {
             if(sn)
             {
                 if (b.GEO_SN == sn) {
                     b.remove();
                 }
             }
             if(key)
             {
                 if (b.GEO_KEY == key) {
                     b.remove();
                 }
             }
         })
     }
 }

p.prototype.addEditbase=function(e,draggingback,dblcallback) {
    if (!this.map)
        return;
    var points = [];
    $.each(e.geometry.coordinates[0], function (i, j) {
        points.push(new BMap.Point(j[0], j[1]));
    })
    var _data = mapv.getLayer(this.map, 'basepoi');
    if (_data) {
        $.each(_data.dataSet._data, function (a, b) {
            if (this.id == e.id) {
                _data.dataSet._data.splice(a, 1);
                _data.dataSet.set(_data.dataSet._data);
              //  points.splice(-1, 1);
                return false;
            }
        })
    }

    if (points.length > 0) {
        this.dellay(e.id);
        //生成新的Poly
        var ploy = new BMap.Polygon(points, {
            fillColor: 'green',
            strokeColor: 'green',
            strokeWeight: 1,
            fillOpacity: 0.6,
            strokeStyle: 'solid',// 或dashed
            enableMassClear: false,
            enableEditing: false,
            //   enableClicking: false

        })
        ploy.GEO_SN = e.id;
        ploy.tgt = e;
        if (e.length == 0)
            return;
        ploy.addEventListener('dblclick', function (e) {
            if (dblcallback && typeof dblcallback == 'function') {
                dblcallback(e.target.tgt);
            }
        })
        this.map.addOverlay(ploy);
        var p = ploy.getPath();
        var i = 0;
        for (; i < p.length; i++) {
            var mark = new BMap.Marker(p[i], {
                icon: new BMap.Icon("../../images/map/tools/draw-pot.png", new BMap.Size(16, 16)),
                enableMassClear: false,
                enableDragging: true,
                enableClicking: false,
            })
            mark.GEO_KEY = 'M_DRAGGING';
            mark.GEO_SN = i;
            mark.addEventListener('dragging', function (e) {
                var ps = ploy.getPath();
                ps.splice(e.currentTarget.GEO_SN, 1, e.point);
                ploy.setPath(ps);
                if (draggingback && typeof  draggingback == 'function') {
                    draggingback(ploy.getPath());
                }
            })
            this.map.addOverlay(mark);
        }
    }
}

p.prototype.addEdit=function(key,draggingback) {
    if(!this.map)
        return;// removeOverlay
     var poly;
         var overlay=this.map.getOverlays();
         if(overlay)
         {
             $.each(overlay,function (a,b) {
                 if(b.GEO_SN==key)
                 {
                     poly=this;
                     return false;
                 }
             })
         }
     if(poly) {

         var p = poly.getPath();
         var i = 0;
         for (; i < p.length; i++) {
             var mark = new BMap.Marker(p[i], {
                 icon: new BMap.Icon("../../images/map/tools/draw-pot.png", new BMap.Size(16, 16)),
                 enableMassClear: false,
                 enableDragging: true,
                 enableClicking: false,
             })
             mark.GEO_KEY = 'M_DRAGGING';
             mark.GEO_SN = i;
             mark.addEventListener('dragging', function (e) {
                 var ps=poly.getPath();
                 ps.splice(e.currentTarget.GEO_SN,1,e.point);
                 poly.setPath(ps);
                 if(draggingback&&typeof  draggingback=='function') {
                     draggingback(poly.getPath());
                 }
             })
             this.map.addOverlay(mark);
         }
         this.map.panTo(p[0])
     }
 }
 p.prototype.getPoints=function (key,delkey) {
     var poly;
     var overlay = this.map.getOverlays();
     if (overlay) {
         if (delkey) {
             $.each(overlay, function (a, b) {
                 if (b.GEO_KEY == delkey) {
                     this.remove();
                 }
             })
         }
         $.each(overlay, function (a, b) {
             if (b.GEO_SN == key) {
                 poly = this;
                 return false;
             }
         })
         if (poly) {
             return poly.getPath();
         }
     }
 }

/**
 * 返回中心点和面积 地市名
 * 
 * @param sn
 * @param callback
 * @return {BMap.Point}
 */
p.prototype.getPloyInfo=function (sn,callback) {
    var poly;
    var overlay = this.map.getOverlays();
    if (overlay) {
        $.each(overlay, function (a, b) {
            if (b.GEO_SN == sn) {
                poly = this;
                return false;
            }
        })
        if (poly) {
            var center = MGeoLib.GeoUtils.getPolygonCenter(poly);
            var cen = center;
            var g = new BMap.Geocoder();
            g.getLocation(center, function (rs) {
            	var city = rs.addressComponents.city;
//                var city = rs.addressComponents.city.replace('市', '');
//                if (city.indexOf('州') > 0) {
//                    if (city.startWith('西双版纳')) {
//                        city = '版纳';
//                    }
//                    else {
//                    	city=city.slice(0, 2);
//                    }
//                }
                var name="";
               if( rs.surroundingPois.length>0)
               {
                   name= rs.surroundingPois[0].title;
               }
               else {
                   name = rs.addressComponents.street;
               }
                if (callback && (callback instanceof Function)) {
                    var center = coordtransform.bd09towgs84(cen.lng, cen.lat);
                    callback({
                        name:name,
                        city: city,
                        district:rs.addressComponents.district,
                        acreage: MGeoLib.GeoUtils.getPolygonArea(poly),
                        center: {lng: center.lng.toFixed(6), lat: center.lat.toFixed(6)}
                    })
                }

            });
        }
    }
}

p.prototype.posPoi=function (text) {
    var ly = mapv.get.getData(this.map, 'basepoi');
    var _self = this;
    $.each(ly, function () {
        if (this.txt == text || this.id == text) {
            if (this.center) {
                var p = this.center.split(",");
                $Layer.panToFlag({lng: p[0], lat: p[1]}, {map: _self.map,coord:'wgs',distimer:5000});
            }
            return false;
        }
    })
}

var cm=UCMap.Component=function () {

}

/**
 * 获取点的位置信息
 * 
 * @param {BMap.Point|Array
 *            <BMap.Point>} point BMap.Point
 * @return {Array<Object>}
 */
cm.prototype.getLocationfromPoints=function(point) {
    if (!point)
        return;
    var points = $.isArray(point) ? point : [point];
    var p = -1;
    var _point = get(points, p);
    var rsl = [];
    var g = new BMap.Geocoder();
    coder();

    function coder() {
        if (!_point)
            return rsl;
        g.getLocation(_point, function (rs) {
            var com = rs.addressComponents;
            var poi = [];
            if (rs.surroundingPois.length > 0) {
                var k = 0;
                for (; k < rs.surroundingPois.length; k++) {
                    var _poi = rs.surroundingPois[k];
                    poi.push({title: _poi.title, address: _poi.address, point: _poi.point})
                }
            }
            rsl.push({provice: com.province, city: com.city, district: com.district, street: com.street, poi: _poi});
            coder(get(points, p));
        });
    }
}

/**
 * 获取点的位置信息
 * 
 * @param {BMap.Point}
 *            point BMap.Point
 * @return {Array<Object>}
 */
cm.prototype.getLocationfromPoint=function(point,callback) {
    if (!point)
        return;
    var g = new BMap.Geocoder();
    g.getLocation(point, function (rs) {
        var com = rs.addressComponents;
        var poi = [];
        if (rs.surroundingPois.length > 0) {
            var k = 0;
            for (; k < rs.surroundingPois.length; k++) {
                var _poi = rs.surroundingPois[k];
                poi.push({title: _poi.title, address: _poi.address, point: _poi.point})
            }
        }
        if(callback&&typeof callback=='function')
        {
            callback({provice: com.province, city: com.city, district: com.district, street: com.street, poi: poi});
        }
    });
}


/**
 * 获取位置点
 * 
 * @param {Object|Array
 *            <Object>} location location{address:,city}
 * @return {Array<Object>}
 */
cm.prototype.getPointformLocation=function(location) {
    if (!location)
        return;
    var locations = $.isArray(location) ? location : [location];
    var p = -1;
    var _location = get(locations, p);
    var rsl = [];
    decoder();

    function decoder() {
        if (!_location)
            return rsl;
        var ls = new BMap.LocalSearch(_location.city || '昆明');
        ls.clearResults();
        ls.search(_location.address||'');
        ls.enableAutoViewport();
        ls.setSearchCompleteCallback(function (rs) {
            if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
                var rsl = rs.getCurrentNumPois();
                for (var p = 0; p < rsl; p++) {
                    var poi = rs.getPoi(p);
                    rsl.push({
                        province: poi.province,
                        city: poi.city,
                        title: poi.title,
                        point: poi.point,
                        address: poi.address
                    });
                }
            }
            decoder();
        })
    }
}

function  get(data,idx) {
    idx++;
    if(idx>=data.length)
        return;
    return data[idx];
}


/**------------------------------------**/
/**
 * @param {Array} selectors
 * @param [objdect] option center/city
 * @type {Window.UCMap.LinkageMap}
 */
var lM=UCMap.LinkageMap=function (selectors,option) {
    if(!selectors)
        return;
    if(!(selectors instanceof  Array))
        return;
    $m.mv={};
    var iZ=false,iM=false;var t1;var  t2;var  iZC=0,iMC=0;
    $.each(selectors,function () {
        (new imap(this,option));
    });
    var k=setInterval(function () {
        if($m.mv&&Object.getOwnPropertyNames($m.mv).length==selectors.length) {
            clearInterval(k);
            $.each($m.mv,function () {
                var  self=this;
                self.addEventListener('zoomend',function () {
                    iZC++;
                    if (iZ==true)
                        return;
                    iZ=true;
                    var e = self.getContainer().id;
                    if ($m.mv) {
                        $.each($m.mv, function (a, b) {
                            if ((a != e)) {
                                this.setZoom(self.getZoom());
                            }
                        })
                        clearInterval(t1);
                        t1=setInterval(function () {
                            if(iZC==selectors.length)
                            {
                                clearInterval(t1);
                                iZC=0;iZ=false;
                            }
                        },50)
                    }

                })
                self.addEventListener('moveend',function () {
                    iMC++;
                    if (iM==true)
                        return;
                    iM=true;
                    var e = self.getContainer().id;
                    if ($m.mv) {
                        $.each($m.mv, function (a, b) {
                            if ((a != e)) {
                                    this.panTo(self.getCenter());
                            }
                        })
                        clearInterval(t2);
                        t2=setInterval(function () {
                            if(iMC==selectors.length)
                            {
                                clearInterval(t2);
                                iMC=0;iM=false;
                            }
                        },50)

                    }
                });



            })
        }
    },100)

    this.wm=function(cfb) {
        var t=setInterval(function () {
            if($m.mv&&Object.getOwnPropertyNames($m.mv).length==selectors.length) {
                clearInterval(t);
                cfb();
            }
        },10)
    }
}

/**
 *
 * @param info [{city,date,e}] or {city,date}
 * @param date
 * @param e
 */
lM.prototype.cell=function(info) {
    this.wm(function () {
        if(info instanceof  Array)
        {
            $.each(info, function (a, b) {
                (new cells($m.mv[this.e], this.city, this.date));
            })
            return;
        }
        $.each($m.mv, function (a, b) {
            (new cells(b, city, date));
        })
    })
}

/**
 * [
 {
                text: '业务图层',
                mbLayer: [
                    {
                        text: '故障基站设备',
                        callback: function () {
                            _this.drawLayer.drawWarning();
                        }
                    },
                    {
                        text: '用户周边投诉点',
                        title: '一个月内周边其他用户投诉点',
                        callback: function () {
                            _this.drawLayer.drawUclPoint();
                        }
                    }]}]
 * @param e
 * @param lyrs
 */

lM.prototype.bussLayer=function(e,lyrs) {
    this.wm(function () {
        $("#" + e + ' #blayer').remove();
        $("#" + e).append("<div class='mbussLayer' id='blayer'> </div>");
        basemap.addbussBox(lyrs, '#blayer');
    })
}
/**
 * get map
 * @param e
 * @returns {*}
 */
lM.prototype.get=function (e) {
    return $m.mv[e];
}

lM.prototype.drawLayer=function(e,cfb){
    var self=this;
    setTimeout(function () {
        self.wm(function()
        {
            if(cfb&&typeof  cfb=='function')
            {
                cfb(self.get(e));
            }
        });
    },100)
}

var $m={
}


function  imap(e,option) {

    //var _m = new BMap.Map(e, {
    //    minZoom: 7,
     //   maxZoom: 19,
    //   enableMapClick: false})
     var _m = new SPMap.Map(e);
    _m.enableScrollWheelZoom();
    _m.disableDoubleClickZoom();
    _m.enableKeyboard();
    _m.setMapStyle({style:'bluish'})
    _m.setDefaultCursor('auto');
    _m.addEventListener('tilesloaded',a);

    _m.addEventListener('zoomend',function () {
        $("#"+e+" .zoom-class-label").text("等级 " + _m.getZoom());
    });
    _m.centerAndZoom((option && option.city) || '昆明', 17);

    pg(e);

    var lonlat = document.querySelector("#"+e+" .lon-lat-label");
    _m.addEventListener("mousemove", function (e) {
        var wgs=coordtransform.bd09towgs84( e.point.lng,e.point.lat)
        lonlat.innerText = wgs.lng.toFixed(6) + '° ' +wgs.lat.toFixed(6) + '°';
    });

    //地图点击事件
    // _m.addEventListener("click", function (e) {
    //     var wgs=coordtransform.bd09towgs84( e.point.lng,e.point.lat);
    // });

    var l=new Legend();
    l.init(e,true);

    function  a() {
        _m.removeEventListener('tilesloaded',a);
        $m.mv[e]=_m;
    }
    function pg(elem) {
        $("#"+elem).append(
            //工具栏
            "<div class=\"map-tools\">\n" +
            "</div>\n"+
            //状态栏
            "<div class=\"map-status\" style='bottom: 0px;'>\n" +
            "<span>\n" +
            "<div class=\"lon-lat-label\" id=\"lon-lat-label-id-\"+elem>0.000000  0.000000</div>\n" +
            " <div class=\"vertical-line\"></div>\n" +
            " <div class=\"zoom-class-label\" id=\"zoom-class-label-id-\"+elem>等级  </div>\n" +
            "<div class=\"vertical-line\"></div>\n" +
            "<input class=\"sel-info-btn\" id=\"sel-info-btn-id-\"+elem type=\"button\"  value=\"\"></input>\n" +
            " <div class=\"vertical-line\" ></div>\n" +
            "<div class=\"map-loading\" id=\"map-loading-id-\"+elem style='display: none'><i></i><span></span></div>\n" +
            "<div class=\"map-date-label\" id=\"map-date-label-id-\"+elem> </div>\n" +
            "</span>\n" +
            " </div>\n"
        );
        $("#"+elem).append("<div id='map-tip' style=' position: absolute;\n" +
            "display: none;\n" +
            "box-shadow:  #0a4554 0px 0px 10px;\n" +
            "border: 1px solid #1e4f6b;\n" +
            "background: #1e4f6b;\n" +
            "word-wrap:break-word;\n" +
            "padding: 5px;\n" +
            "color: white;'></div>")


        //poi地址搜索


        $("#"+elem).append("<div class=\"map-address-poi\" id=\"map-address-poi-id\" style='width: 250px;height: 100px !important;left:30%;'>\n" +
            "<h4 style='text-align: left'><label  style=\"height: 28px;font-size: 18px;padding: 10px;margin-bottom: 10px\">POI定位</label></h4>\n" +
            "<input  class=\"p-content-cancel\"   type=\"button\"  value=\"×\" title=\"关闭\" \" ></input>\n" +
            "<input class=\"p-content-text layui-input\"style='display: initial;margin-left: 10px;height: 34px;width: 150px;' focusplaceholder=\"输入ID\" type='text' value=\"\" >" +
            "<input class=\"p-content-ok\"  type=\"button\"  style='margin-top: 5px;margin-left: 10px' value=\"定位\"></input></div>");

        $("#"+elem+" .p-content-cancel").click(function () {
            $("#"+elem+" #map-address-poi-id").css("display","none");
        })

        $("#"+elem+" .p-content-ok").click(function () {
            $.ajax({
                type: 'post',
                url: '/userperce/UCMapv/getPoiCenter',
                data: {poiId:$("#"+elem+" .p-content-text").val()},
                success: function (data) {
                    if(data!=null){
                        $("#"+elem+" #map-address-poi-id").css("display","none");
                        var data=data.split(',');
                        var coord = coordtransform.wgs84tobd09(data[0],data[1]);
                        //
                        // $Layer.panToFlag(coord, {map: $m.mv[elem]});
                        // $Layer.panToFlag(coord, {map: $m.mv[elem]});
                        for (var i in $m.mv) {
                            $Layer.panToFlag(coord, {map: $m.mv[i]});
                        }
                    }else{
                        msg("无该POI信息");
                    }
                }
            });
        })


        basemap.addbussBox([
            {
                url: "../../images/map/tools/zoom-out.png",
                callback: function (e) {
                    $m.mv[elem].zoomIn();
                },
                title:'放大地图',
                enabled:true,
                unselected:true
            },
            {
                url: "../../images/map/tools/zoom-in.png",
                callback: function (e) {
                    $m.mv[elem].zoomOut();
                    (new Legend()).close();
                },
                title:'缩放地图',
                enabled:true,
                unselected:true
            },
            // {
            //     url: "../../images/map/tools/rec-zoomout.png",
            //     callback: function (e) {
            //         basemap.mapvw=$m.mv[elem];
            //         maptool.rec_zoomout(e,-1);
            //     },
            //     title:'拉框放大',
            //     enabled:true
            // },
            // {
            //     url: "../../images/map/tools/rec-zoomin.png",
            //     callback: function (e) {
            //         basemap.mapvw=$m.mv[elem];
            //         maptool.rec_zoomout(e,1);
            //     },
            //     title:'拉框缩小', enabled:true
            // },
            // {
            //     url: "../../images/map/tools/measure.png",
            //     callback: function (e) {
            //         basemap.mapvw=$m.mv[elem];
            //         maptool.measure_open(e);
            //     },
            //     title:'测量距离', enabled:true
            // },
            {
                url: "../../images/map/tools/clearlayer.png",
                callback: function (e) {
                    $m.mv[elem].clearOverlays();
                },
                title:'清除样式',
                enabled:true,
                unselected:true
            },
            {
                url: "../../images/map/tools/cell-pos.png",
                callback: function (e) {
                    $("#"+elem+" #map-address-poi-id").css("display","block");
                },
                title:'POI定位',
                enabled:true,
                unselected:true
            },



        ],'#'+elem+' .map-tools')
    }
}


function  cells(map,city,date) {
    map.clearOverlays();

    var imgsector = new Image();
    imgsector.src = '../../images/map/symbols/sectorv' + Getfilename(4) + '.png';
    var imgsite = new Image();
    imgsite.src = '../../images/map/symbols/sitev.png';
    var siteLPoint=[],sectorLPoint=[];
    $.ajax({
        type: 'post',
        url: "/spdbnb/PLteSector/dynamicSqlMap",
        data: {
            city:city,
            Date: date,
            Lng: sectormap.ucpoint ? sectormap.ucpoint.lng : null,
            Lat: sectormap.ucpoint ? sectormap.ucpoint.lat : null,
        },//20170601
        error: function (e) {
            throw '地图扇区加载失败>>>' + e.message;
        },
        success: function (data) {
            if (!data || data.length == 0) {
                $("#map-date-label-id").text("地图 无坐标数据");
                return;
            }
            var coord = coordtransform.wgs84tobd09(data[0].LONGITUDE, data[0].LATITUDE);
            basemap.mapvw.panTo(new BMap.Point(coord.lng, coord.lat));
            //   getSiteData();
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
            addLLayer();
        }
    });

    function Getfilename (net,zoom) {
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

    function loadSite(lon, lat, infomation, img) {
        siteLPoint.push({
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
            icon: img,
            info: infomation,
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
        // SectorSession[sector] = index;
        // index = index + 1;
    }

    function addLLayer() {
        if(siteLPoint.length>0&&sectorLPoint.length>0)
        {
            (new mapv.baiduMapLayer(map, new mapv.DataSet(siteLPoint),{
                draw: 'icon',
                coordType: 'bd0911',
                // methods: {
                //     mousemove: function (e) {
                //         // console.log(e);
                //         showenb(e);
                //         //addMapRightKey(item, e);
                //     },
                //     rightclick: function (item, e) {
                //         // console.log(e);
                //         addMapRightKey(item, e);
                //     }
                // },
                height: 10,
                width: 10,
                size: 10,
                zIndex: 1000,
                mcode:'l-site-lay'
            }));
            (new mapv.baiduMapLayer(map, new mapv.DataSet(sectorLPoint),{
                draw: 'icon',
                height: 52,
                coordType: 'bd0911',
                zIndex: 1001,
                mcode:'l-sector-lay'
                //coordType:'bd09mc'
            }));

            var L = new Legend();
            L.add({m: {f: '#00A9EF', t: '基站'}, k: 'E'})
            L.add({m: {f: '../../images/map/symbols/sectorv' + Getfilename(4) + '.png', t: 'LTE小区'}, k: 'Y'})

            $("#map-date-label-id").text("地图 " + date);
        }
        //清空数组
        if (sectorLPoint.length > 0)
            sectorLPoint.splice(0, sectorLPoint.length);
        if (siteLPoint.length > 0)
            siteLPoint.splice(0, siteLPoint.length);
    }

}
/***----------------------------------end-----------------------***/


var cityValue=null;
function drawPoiTurnLayer1(citycode,yyyymm,selectId,secetorName,map,dateType) {
         $Layer.removeLayer("poiscene", map)
         var Led = new Legend('maps1');
         Led.close("poiscene");
         $.ajax({
             type: 'post',
             url: '/userperce/UCMapv/perceTurnGis',
             data: {citycode: citycode, yyyymm: yyyymm, selectId: selectId,dateType:dateType},
             success: function (data) {
                 if (!data || data.length == 0) {
                     if (cb && typeof cb == 'function') {
                         cb(null);
                     }
                     $Evt.loading.off();
                     return;
                 }
                 var coords = [];
                 var coord = null;
                 var panto;
                 var top = [];
                 $.each(data, function (a, b) {
                     var cds = [];
                     if (b.LOCATIONS) {
                         $.each(b.LOCATIONS, function (c, d) {
                             coord = coordtransform.wgs84tobd09(d.LNG, d.LAT);
                             if (!panto)
                                 panto = coord;
                             cds.push([coord.lng, coord.lat])
                         })
                     }

                     var tu = (b.TULI).split('@');
                     var t0 = tu[0].split('&');
                     var t1 = tu[1].split('&');
                     var t2 = tu[2].split('&');
                     var t3 = tu[3].split('&');


                     var clr='#8CEA00';
                     if (b.CNT >= parseFloat(t0[1]) && b.CNT < parseFloat(t0[2]) ) {
                         clr = '#8CEA00';
                     } else if (b.CNT >= parseFloat(t1[1]) && b.CNT < parseFloat(t1[2])) {
                         clr = 'blue';
                     }else if (b.CNT >= parseFloat(t2[1]) && b.CNT < parseFloat(t2[2])) {
                         clr = 'yellow';
                     }else if (b.CNT >= parseFloat(t3[1]) && b.CNT < parseFloat(t3[2])) {
                         clr = 'red';
                     }
                     if (cds) {
                         coords.push({
                             geometry: {
                                 type: 'Polygon',
                                 coordinates: [cds]
                             }
                             ,
                             fillStyle: clr,
                             txt: b.COMMUNITY_NAME,
                             tag: b.TAG,
                             cnt: b.CNT,
                             deta:b.DETA,
                             pro:b.PRO,
                             id: b.COMMUNITY_ID,
                             clng: b.C_LNG,
                             clat: b.C_LAT,
                             // s: start,
                             // e: end
                         })
                     }
                     // top.push({
                     //     'name': b.COMMUNITY_NAME,
                     //     'tag': b.TAG,
                     //     'cnt': b.CNT,
                     //     'lng': b.C_LNG,
                     //     'lat': b.C_LAT,
                     //     'id': b.COMMUNITY_ID,
                     //     'areaname': null
                     // })
                 })
                 if (coords.length > 0) {
                     var ops = {
                         draw: 'simple',//
                         globalAlpha: 0.6,
                         methods: {
                             mousemove: function (e) {
                                 var id = map.getContainer().id;
                                 if (!e || e.length == 0) {
                                     $('#'+id +' canvas').css('cursor', 'default')
                                     $('#'+id+' #map-tip').css('display', 'none');
                                     return;
                                 }

                                 var o = e[0];
                                 var c = coordtransform.wgs84tobd09(o.clng, o.clat);
                                 var s = map.pointToPixel(new BMap.Point(c.lng, c.lat));
                                 var pro=o.pro==null?"":o.pro;
                                 var deta=o.deta==null?"":o.deta;
                                 $('#'+id+' #map-tip').html("<div style='font-size: 15px'><p>场景：" + o.txt + "</p><p>标签：" + o.tag + "</p>" +
                                     "<p>值：" + o.cnt + "</p><p>问题类型：" +  pro + "</p><p>问题详细占比：" +  deta + "</p></div>");
                                 $('#'+id+' #map-tip').css('left', s.x + 'px');
                                 $('#'+id+' #map-tip').css('top', s.y + 'px');
                                 $('#'+id +' canvas').css('cursor', 'pointer');
                                 $('#'+id+' #map-tip').css('display', 'block');
                             },
                             // click: function (e) {
                             //     if (!e || e.length == 0) {
                             //         return;
                             //     }
                             //     var o = e[0];
                             //     $Layer.drawSceneComplaintLayer(o.id, o.s, o.e);
                             // },

                         }, mcode: 'poiscene'
                     }
                     var md = new mapv.DataSet(coords);
                     var _map = new mapv.baiduMapLayer(map, md, ops);
                     // 图例
                     var tu = (data[0].TULI).split('@');
                     var t0 = tu[0].split('&');
                     var t1 = tu[1].split('&');
                     var t2 = tu[2].split('&');
                     var t3 = tu[3].split('&');

                     Led.add({
                         m: {f: '', t: '' + secetorName + ''},
                         k: 'poiscene',
                         s: [{
                             f: '#8CEA00',
                             t: '[' + t0[1] + ',' + t0[2] + ')'
                         }, {
                             f: 'blue',
                             t: '[' + t1[1] + ',' + t1[2] + ')'
                         },
                             {
                                 f: 'yellow',
                                 t: '[' + t2[1] + ',' + t2[2] + ')'
                             },
                             {
                                 f: 'red',
                                 t: '[' + t3[1] + ',' + t3[2] + ')'
                             }
                             ,
                             // {f: 'red',
                             //     t: '['+t1[1]+','+t1[2]+']'
                             // }
                         ]
                     })
                 }

                 //判断是否变更地市
                 if(cityValue==null || cityValue!=citycode){
                     map.panTo(new BMap.Point(panto.lng, panto.lat))
                 }
                 cityValue=citycode

                 $Evt.loading.off();
             },
             error: function (e) {
                 $Evt.loading.off();
             }
         })
     }

function drawPoiTurnLayer2(citycode,yyyymm,selectId,secetorName,map,dateType) {
    $Layer.removeLayer("poiscene", map)
    var Led = new Legend('maps2');
    Led.close("poiscene");
    $.ajax({
        type: 'post',
        url: '/userperce/UCMapv/perceTurnGis',
        data: {citycode: citycode, yyyymm: yyyymm, selectId: selectId,dateType:dateType},
        success: function (data) {
            if (!data || data.length == 0) {
                if (cb && typeof cb == 'function') {
                    cb(null);
                }
                $Evt.loading.off();
                return;
            }
            var coords = [];
            var coord = null;
            var panto;
            var top = [];
            $.each(data, function (a, b) {
                var cds = [];
                if (b.LOCATIONS) {
                    $.each(b.LOCATIONS, function (c, d) {
                        coord = coordtransform.wgs84tobd09(d.LNG, d.LAT);
                        if (!panto)
                            panto = coord;
                        cds.push([coord.lng, coord.lat])
                    })
                }

                var tu = (b.TULI).split('@');
                var t0 = tu[0].split('&');
                var t1 = tu[1].split('&');
                var t2 = tu[2].split('&');
                var t3 = tu[3].split('&');
                // var clr = '#8CEA00';
                // if (b.CNT >= t2[2] && b.CNT < t3[1] ) {
                //     clr = 'red';
                // }
                // else if (b.CNT >= t1[2] && b.CNT < t0[2]) {
                //     clr = 'yellow';
                // }
                // else if (b.CNT >= t0[2] && b.CNT < t1[2] ) {
                //     clr = 'blue';
                // }
                var clr='#8CEA00';
                if (b.CNT >= parseFloat(t0[1]) && b.CNT < parseFloat(t0[2]) ) {
                    clr = '#8CEA00';
                } else if (b.CNT >= parseFloat(t1[1]) && b.CNT < parseFloat(t1[2])) {
                    clr = 'blue';
                }else if (b.CNT >= parseFloat(t2[1]) && b.CNT < parseFloat(t2[2])) {
                    clr = 'yellow';
                }else if (b.CNT >= parseFloat(t3[1]) && b.CNT < parseFloat(t3[2])) {
                    clr = 'red';
                }

                if (cds) {
                    coords.push({
                        geometry: {
                            type: 'Polygon',
                            coordinates: [cds]
                        }
                        ,
                        fillStyle: clr,
                        txt: b.COMMUNITY_NAME,
                        tag: b.TAG,
                        cnt:b.CNT,
                        deta:b.DETA,
                        pro:b.PRO,
                        id: b.COMMUNITY_ID,
                        clng: b.C_LNG,
                        clat: b.C_LAT,
                        // s: start,
                        // e: end
                    })
                }
                // top.push({
                //     'name': b.COMMUNITY_NAME,
                //     'tag': b.TAG,
                //     'cnt': b.CNT,
                //     'lng': b.C_LNG,
                //     'lat': b.C_LAT,
                //     'id': b.COMMUNITY_ID,
                //     'areaname': null
                // })
            })
            if (coords.length > 0) {
                var ops = {
                    draw: 'simple',//
                    globalAlpha: 0.6,
                    methods: {
                        mousemove: function (e) {
                            var id = map.getContainer().id;
                            if (!e || e.length == 0) {
                                $('#'+id +' canvas').css('cursor', 'default')
                                $('#'+id+' #map-tip').css('display', 'none');
                                return;
                            }

                            var o = e[0];
                            var c = coordtransform.wgs84tobd09(o.clng, o.clat);
                            var s = map.pointToPixel(new BMap.Point(c.lng, c.lat));
                            var pro=o.pro==null?"":o.pro;
                            var deta=o.deta==null?"":o.deta;
                            $('#'+id+' #map-tip').html("<div style='font-size: 15px'><p>场景：" + o.txt + "</p><p>标签：" + o.tag + "</p>" +
                            "<p>值：" + o.cnt + "</p><p>问题类型：" +  pro + "</p><p>问题详细占比：" +  deta + "</p></div>");
                            $('#'+id+' #map-tip').css('left', s.x + 'px');
                            $('#'+id+' #map-tip').css('top', s.y + 'px');
                            $('#'+id +' canvas').css('cursor', 'pointer');
                            $('#'+id+' #map-tip').css('display', 'block');
                        },
                        // click: function (e) {
                        //     if (!e || e.length == 0) {
                        //         return;
                        //     }
                        //     var o = e[0];
                        //     $Layer.drawSceneComplaintLayer(o.id, o.s, o.e);
                        // },

                    }, mcode: 'poiscene'
                }
                var md = new mapv.DataSet(coords);
                var _map = new mapv.baiduMapLayer(map, md, ops);
                // 图例
                var tu = (data[0].TULI).split('@');
                var t0 = tu[0].split('&');
                var t1 = tu[1].split('&');
                var t2 = tu[2].split('&');
                var t3 = tu[3].split('&');
                Led.add({
                    m: {f: '', t: '' + secetorName + ''},
                    k: 'poiscene',
                    s: [{
                        f: '#8CEA00',
                        t: '[' + t0[1] + ',' + t0[2] + ')'
                    }, {
                        f: 'blue',
                        t: '[' + t1[1] + ',' + t1[2] + ')'
                    },
                        {
                            f: 'yellow',
                            t: '[' + t2[1] + ',' + t2[2] + ')'
                        },
                        {
                            f: 'red',
                            t: '[' + t3[1] + ',' + t3[2] + ')'
                        }
                        ,
                        // {f: 'red',
                        //     t: '['+t1[1]+','+t1[2]+']'
                        // }
                    ]
                })
            }

            // map.panTo(new BMap.Point(panto.lng, panto.lat))
            $Evt.loading.off();
        },
        error: function (e) {
            $Evt.loading.off();
        }
    })
}



/**
 * 加载简单地图
 */
var sm=UCMap.Simple=function(elem)
{
	this.map = new SPMap.Map(elem);
	}

sm.prototype.do=function(callback)
{
	if(callback&&typeof callback==='function')
		{
			callback(this.map);
		}
}

/**
 * @para data 数据对象
 * @para option 选项
 * @para layername 图层名
 * @para callback
 */
sm.prototype.layer=function(data,option,layername,panpoint,callback)
{
	var $map=this.map;
	waitjs('mapv',function(){
		$Layer.removeLayer(layername,$map);
		if(!data||data.length==0)
			return;
		var k=setTimeout(function() {
			option.mcode=layername;
			(new mapv.baiduMapLayer($map,new mapv.DataSet(data),option));
			if (panpoint) {
				$map.panTo(new BMap.Point(panpoint.lng,panpoint.lat))
			}	
			if(callback&&typeof callback==='function')
			{
				callback();
			}
		
		}, 500)
	})
}

sm.prototype.layers={
		 
}

 

function waiting(state) {
    var numberMillis=3600000;
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime()>exitTime)
            return;
        if(state==true)
            return;
    }
}












