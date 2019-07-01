/**
 * @version 1.0
 * @author yuan
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.SPMap = global.SPMap || {})));
}(this, (function (exports) {
    'use strict';
    var p=function (lng,lat,coordsys) {
        var c;
        var _sys = coordsys || 'wgs';
        if (_sys == 'wgs') {
            c = CM.wb(lng, lat);
        }
        else if (_sys == 'gcj') {
            c = CM.gb(lng, lat);
        }
        this.lng = c ? c.lng : lng;
        this.lat = c ? c.lat : lat;
        return this;
    }

    var l=false;
    /**
     *
     * @param mElem
     * @param option {defcity/defpoint,defzoom}
     */
    var m=function (mElem,option) {
        if ($("#" + mElem).length == 0)
        {
            throw new Error("no such id selector.");
        }
        this._e=mElem;
        this._p = option;
        var c=$c.gc;
        $("#" + mElem).append("<div id='"+c+"' style='position: relative;height: 100%;width: 100%'></div>");
        l=false;
        var _m;
        try {
             _m = new BMap.Map(c, {
                minZoom: 3,
                maxZoom: 19,
                enableMapClick: false
            });
            l=true;
        }
        catch (e) {
            try {
                $.ajax({
                    type: "post",
                    url: '../../js/olmap/olmap-modify.js',
                    async: false,
                    success: function () {
                        _m= ol();
                        l=true;
                    },
                    error: function () {

                    }
                })
            }
            catch (e) {

            }
        }

        if(!_m) {
            throw  new Error('load map failed.');
        }

        this.sID=c;
        this.sLY={};
        this.sEV={};
        _m.centerAndZoom('广州', 17);

        _m.enableScrollWheelZoom();
        _m.disableDoubleClickZoom();
        _m.enableKeyboard();
        _m.setMapStyle({style:'bluish'})
        _m.setDefaultCursor('auto');

        var _this=this;
        _m.addEventListener('zoomend',function () {
            _this.sFV=undefined;
            (new __d()).updateCache(_this._e);
        })
        // map.addEventListener('dragend',function () {
        //     update();
        // })
        _m.addEventListener('moveend',function () {
            if (_this.sFV) {
                if (_m.getZoom() != _this.sFV) {
                    _m.setZoom(_this.sFV);
                    return;
                }
            }
            (new __d()).updateCache(_this._e);
        })

        _m.addEventListener("tilesloaded",f);
        function f() {
            _m.removeEventListener("tilesloaded",f), _this.sEM=_m,$c.mv[_this._e]=_this;
            l=true;
        }
        function ol() {
            var outputPath = '/olmap/tiles/';
            var fromat = ".png";    //格式
            var tileLayer = new BMap.TileLayer();
            tileLayer.getTilesUrl = function (tileCoord, zoom) {
                var x = tileCoord.x;
                var y = tileCoord.y;
                var url = outputPath + zoom + '/' + x + '_' + y + fromat;
                return url;
            }
            var tileMapType = new BMap.MapType('tileMapType', tileLayer);

             _m = new BMap.Map(c, {mapType: tileMapType});
            var _option = option || {
                minZoom: 7,
                maxZoom: 19,
                defCity: '昆明',
                defLocation: {Lng: 102.762764, Lat: 25.002435},
                enableZoomByScrollWheel: true
            }
            _m.setMaxZoom(17);
            _m.setMinZoom(7);

            // 创建地图实例
            var point = new BMap.Point(102.762764, 25.002435);  // 创建点坐标
            _m.centerAndZoom(point, 13);
            _m.disableDoubleClickZoom();
        }
        return this;
    }
    m.prototype.bindEvent=function (name,event) {
        if(name=='mClick'||name=='mDbclick'||name=='mRightclick'||name=='mMousemove')//用于图层事件
        {
            var _nm=name.replace('m','').toLowerCase();
            $c.rm[_nm]={};
            $c.rm[_nm].cb=event;
            $c.rm[_nm]._e=this._e;
            return;
        }
         $c.gM(this._e).addEventListener(name,event);
    }
    m.prototype.removeEvent=function()
    {

    }

    /**
     *
     * @param elem
     * @param {Object} option{item: def} [{tip,lock,stype,onstype, cbf,sub[text,title,lock,stype,onstype]}]
     * /item:'zoom-in/zoom-out/rect-in/rect-out/clear-lyr/measure-length/measure-area/address-query/location-pos'
     */
    m.prototype.addTools=function (option) {
        if (!option || jQuery.isEmptyObject(option))
            return;
        var _my = $c.gM(this._e);
        var _option = [];

        if (option.item) {
            option.item == 'default' && (option.item = ['zoom-in', 'zoom-out', 'rect-in', 'rect-out', 'clear-lyr', 'measure-length', 'measure-area', 'address-query', 'ocation-pos'])
            $.each(option.item, function () {
                switch (this) {
                    case  'zoom-in':
                        var a=$c.tl[1];
                        a.cbf = function () {
                            _my.zoomIn();
                        }
                        _option.push(a);
                        break;
                    case  'zoom-out':
                        var a=$c.tl[0];
                        a.cbf = function () {
                            _my.zoomOut();
                        }
                        _option.push(a);
                        break;
                    case  'rect-in':
                        _option.push($c.tl[3].cbf = function () {
                            (!$c.js(0) && $c.aJ(0, function () {
                                rz(0)
                            })) ||rz(0);
                        });
                        break;
                    case  'rect-out':
                        _option.push($c.tl[2].cbf = function () {
                            (!$c.js(0) && $c.aJ(0, function () {
                                rz(1)
                            })) ||rz(1);
                        });
                        break;
                    case  'clear-lyr':
                        _option.push($c.tl[6].cbf = function () {
                            $.each(_my.sLY, function () {
                                if (this._remove) {

                                }
                            })
                        });
                        break;
                    case  'measure-length':
                        _option.push($c.tl[4].cbf = function () {

                        });
                        break;
                    case  'measure-area':
                        _option.push($c.tl[5].cbf = function () {

                        });
                        break;
                    case  'address-query':
                        _option.push($c.tl[7].cbf = function () {

                        });
                        break;
                    case  'location-pos':
                        _option.push($c.tl[8].cbf = function () {

                        });
                        break;
                }
            })
        };
        if (option.def)
            Array.prototype.push.apply(_option, option.def);
        var _self=this;
        w(this._e,function () {
            $('#' + _self._e).append($($("<div class='map-tools'></div>")).append(t(_option,_self._e)));
        })
        
        function rz(z) {
            (new SPMLib.RectangleZoom(_my, {
                zoomType: z,
                strokeWeight: 1,
                strokeColor: 'red',
                //followText: '点击图标关闭',
                opacity: 0.8,
                autoClose: false
            })).open();
        }
    }

    /**
     * @param option [{text,title,lock,stype,onstype,sub[text,title,lock,stype,onstype]} ]
     */
    m.prototype.addLayerMenu=function(option) {
        $('#' + this._e).append($($("<div class='lyr-menu'></div>")).append(t(option)));
    }
    
    /**
     * @desc add statusbar
     * @param [Array<Object>] label [{class,id:,style,text,}]
     */
    m.prototype.addStatusBar=function (label) {
        var m=$c.gO(this._e);
        $('#' + m.sID).append("<div class=\"map-status\">\n" +
            "<span>\n" +
            "<div class=\"lon-lat-label map-status-label\" id=\"lonlat-label-id\">0.000000  0.000000</div>\n" +
            "<div class=\"vertical-line\"></div>\n" +
            "<div class=\"zoom-label map-status-label\" id=\"zoom-label-id\">等级 "+m.getZoom()+"</div>" +
            "</span></div>");
        if (label) {
            var _label=label instanceof  Array?label:[label];
            $.each(_label, function () {
                $('#' + m.sID + ' .map-status span').append("<div class='vertical-line'/>"+this);
                $('#' + m.sID + ' .map-status span').children().last().addClass('map-status-label');
            })
        };
        var me=this._e;
        this.bindEvent('zoomend',function (e) {
            $('#'+me+' #zoom-label-id').text('等级 '+m.getZoom());
        });
        var p;
        this.bindEvent('mousemove',function (e) {
            p=CM.bw(e.point.lng,e.point.lat);
            $('#'+me+' #lonlat-label-id').text(p.lng.toFixed(6)+'° '+p.lat.toFixed(6)+'°')
        });
    }


    m.prototype.addLegend=function (option) {

    }
    m.prototype.panAndFlag=function () {

    }

    /**
     * addRightkey
     */
    m.prototype.addRightKey=function() {

    }

    /**
     * addRightkey
     */
    m.prototype.setTip=function (text) {
        
    }
    
    m.prototype.addLayer=function (layer) {
        layer._e=this._e;
        (new w(this._e,function () {
            aL(layer);
        }));
    }

    function w(e,caller) {
        var time=0;
        var t = setInterval(function () {
            if (e in $c.mv) {
                clearInterval(t);
                if (caller && typeof  caller == 'function') {
                    caller();
                }
                return;
            }
            time++;
            if(time>1000) {
                clearInterval(t);
                throw  new Error("load map timeout for id="+e);
            }
        }, 10)
    }
    function $r(w,n,c) {
        var para=w||{};
        $.ajax(
            {
                type: 'post',
                url: $c.dm.r(n),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data: JSON.stringify(para),
                success: function (r) {
                    if (c && typeof c == 'function') {
                        c(r);
                    }
                },
                error: function () {

                }
            }
        )
    }
    $(function () {
        setInterval(function () {
            if (jQuery.isEmptyObject($c.mv)) {
                return;
            }
            var gp = [];
            $.each($c.mv, function () {
                $.each(this.sLY, function () {
                    if (this instanceof SPMap.CacheLayer) {
                        gp.push(this._lc);
                    }
                })
            })
            gp.length > 0 && (new $r({L: gp.join('&')}, 0))
        }, 120000)
    })
    function t(option,e) {
        var _option=option instanceof  Array?option:[option];
        var elem = $("<div class='header-item'></div>")[0];
        $.each(_option, function () {
            var box = dom(this);
            if (this.sub && this.sub.length > 0) {
                var _box = $('<div class="sub-item" style="display: none;"></div>');
                $.each(this.sub, function () {
                    var __box = dom(this);
                    $(__box).attr('lock', this.lock && this.lock == false ? 0 : 1);
                    $(_box).append(__box)
                })

                $(box).append(_box[0]);
                $(box).hover(function () {
                    $(_box[0]).fadeIn(500);
                    //$(_box[0]).animate({top:'26px',opacity:1},200);
                    //$(_box[0]).css("display",'inline-flex');
                    //$(_box).removeClass('sub-box-hide').addClass('sub-box-show');
                }, function () {
                    $(_box[0]).fadeOut(300);
                    // $(_box[0]).animate({top:'0px',opacity:0},200);
                    //$(_box[0]).css("display",'none');
                    // },10)
                    // $(_box).removeClass('sub-box-show').addClass('sub-box-hide');
                })
            }
            else {
                $(box).attr('lock', this.lock && this.lock == false ? 0 : 1);
            }
            elem.append(box);
        });
        return elem;
        function style(obj, s) {
            if(!s)
                return;
            if (s.indexOf('.') >= 0 || s.indexOf('http') >= 0) {//on: 	#ff4500	255,69,0  off:99,185,247 #63B9F7
                var _img=$(obj).children('img');
                if (_img.length>0)
                {
                     $(_img).attr('src',s);
                     return;
                }
                $(obj).append("<img class='mtool-nav-img' src='" + s + "'/>");return;
            }
            $(obj).css('background', s);
        }

        function dom(op) {
            var div = $("<span class='mtool-box'></span>")[0];
            op.style && style(div, op.style);
            // op.text && $(div).append("<i>" + op.text + "</i>")
            op.cbf&&$(div).css('cursor','pointer') && $(div).on('click', function (r) {
                style(this,op.onstyle);
                $.each($('#'+e+' .map-tools>.mtool-box'),function () {
                    if($(this).attr('lock')==1)
                    {
                        $(box).css('pointer-events','none');
                    }
                    else
                    {
                        $(box).css('pointer-events','');
                    }
                })
                op.cbf(r);
            })

            op.onstyle&&$(div).hover(function () {
                (new style(div,op.onstyle));
            },function () {
                (new style(div,op.style));
            })
            return div;
        }
    }

    function aL(layer) {
        if (!layer)
            return;
        if (layer instanceof SPMap.DataLayer) {
            adl(layer)
        }
        else if (layer instanceof SPMap.CacheLayer) {
            acl(layer)
        }
        else {
            throw  new Error("layer is not SPMap.DataLayer or  SPMap.CacheLayer.")
        }
    }
    function  adl(a) {
        var m = $c.gM(a._e);
        if(!m)
            return;
        //清除图层
        var l=$c.gL(a._e,a._name);
        l&&(l.remove());
        if (!a._data.points || a._data.points == 0) {
            return;
        }
        var _this = a;
        // _this._option = (new __c()).option(_this._type, b);
        var _data = _this._data;
        delete  _this._data;

        var data = (new __d).set(_data, _this._type, _this._estyle);

       (new mgv.SPLayer(m, data, _this));
        if (a._fv && a._fv == true) {
            var z = (new __c()).boundZoom(m, {sw: _data.sw, ne: _data.ne});
            ($c.gO(_this._e)).sFV = z;
        }
      // m.panTo(new BMap.Point(102.7581666282445, 24.716124242333617));
       m.panTo(new BMap.Point(_data.cp.lng, _data.cp.lat));
        $c.aL(_this)
    }
    function acl(a) {
        var m = $c.gM(a._e);
        if (!m) {
            return;
        }
        //清除图层
        var l=$c.gL(a._e,a._name);
        l&&(l.remove());
        var _this = a;
        var cc = new __c();
        // _this._option = cc.option(_this._type, b);

        //当前窗口
        var ne = m.getBounds().getNorthEast();
        var sw = m.getBounds().getSouthWest();
        var r = sw.lng + ',' + sw.lat + ',' + ne.lng + ',' + ne.lat

        if (a._fv && a._fv == true) {
            var s = m.getSize();
            cc.fullview({P: {x: s.width, y: s.height}, L: _this._lc}, function (r) {
                if (!r)
                    return;
                ($c.gO(_this._e)).sFV = r.Z + 1;
                m.panTo(new BMap.Point(r.C.lng, r.C.lat));
                $c.aL(_this)
            })
        }
        else {
            (new __d()).getCacheData(_this, r, 'init', function (data) {
                data.points && new mgv.SPLayer(m, data, _this);
                data.cp && m.panTo(new BMap.Point(data.cp.lng, data.cp.lat));
                $c.aL(_this)
            })
        }
    }
    function  le() {
        /**
         *@desc add Layer to Map
         * @param {String} elem
         */
        this.addTo = function (elem) {
            var _this=this;
            _this._e=elem;
            (new w(elem, function () {
                aL(_this)
            }))
        };
        this.show = function () {
            var l = $c.gt(this._e, this._name);
            l && l.show();
        };
        this.hide = function () {
            var l = $c.gt(this._e, this._name);
            l && l.hide();
        };
        this.remove = function () {
            var l = $c.gt(this._e, this._name);
            l && l.remove(), l.dataSet.clear(), delete $c.gO(this._e).sLY[this._name];
        };
        // this.addRightMenu=function (rk) {
        //     if(!rk||rk instanceof  __r)
        //     {
        //         return;
        //     }
        //     var t=setInterval(function () {
        //         if (rk.Menu&&this._pm._e&&this.name&&$c.gt(this._pm._e,this.name))
        //         {
        //             clearInterval(t);
        //
        //         }
        //     },50)
        // };
        this.addLed = function () {

        };
        /**
         * @desc  update
         * @param option {
         *     data:Array<{point:SPMap.Point,contexts:[{a:b}]}>
         *     name:
         *     type:point/line/surface/img/circle/tiles/label/grid
         *     estyle:{}
         * }
         */
        this.setData = function (data) {
            var _data = __l.dl(data);
            var data = (new __d).set(_data._data, _data._type, _data._estyle);
            var l = $c.gt(this._e, data.name);
            l && data && l.dataSet.set(data), l.dataSet.update();
        };
        this.setOption = function (option) {
            var l = $c.gt(this._e, this._name);
            l && (l.options = (new __c).option(this._type, option));
        }
    }
    var __l={
        /**
         * @desc DataLayer
         * @param option {
         *     data:Array<{point:SPMap.Point,contexts:[{a:b}]}>
         *     name:
         *     type:point/line/surface/img/circle/tiles/label/grid
         *     estyle:{},
         *     istoclear:true/false,
         *     event:[{click:function(e){}},{rightclick:function(e){}},{dbclick:function(e){}},{mousemove:function(e){}}],
         *     astyle:{fclr,size,} 统一样式,
         *     fullview:true/false
         * }
         */
        dl:function (option) {
            if (jQuery.isEmptyObject(option))
            {
                throw  new Error("option is Empty object");
            }
            if (!option.name||option.name =='') {
                throw  new Error("layer name does not exist");
            }
            if (!option.type||option.type =='') {
                throw  new Error("layer type does not exist");
            }
            if (!(option.type in $c.ge)) {
                throw  new Error("this type is not surported.");
            }
            le.bind(this)();
            var $_c=new __c();
            $_c.estyle(option);
            this._option = $_c.option(option.type,option.astyle,option.event);
            this._name = option.name;
            this._type = option.type;
            this._fv  = option.fullview;
            this._estyle=option.estyle;
            var all=[];
            var j={};
            var odata=option.data;
            if (odata) {
                j.points = [];
                odata = odata instanceof Array ? odata : [odata];
                if (this._type == "line" || this._type == "surface") {
                    if (odata[0].point.length > 0 && !(odata[0].point[0] instanceof SPMap.Point)) {
                        throw new Error("Point is not SPMap.Point.");
                    }
                }
                else if(!(odata[0].point instanceof SPMap.Point)) {
                    throw new Error("Point is not SPMap.Point.");
                }
                $.each(odata, function () {
                    // f(this.point);
                    this.POINTS=this.point;
                    this.CP=$_c.getDataBound(this.point)['cp'];
                    if(this.vals) {
                        this.VALS = this.vals;
                        delete this.vals;
                    }
                    delete this.point;
                    all.push(this.CP);
                    j.points.push(this);
                })
                var r = $_c.getDataBound(all);
                for (var r1 in r) {
                    j[r1] = r[r1];
                }
            }
            this._lc = $c.ui();
            this._cls = 'data';
            this._data=j;

            // //每一条数据
            // function f($data) {
            //     if ($data instanceof Array) {
            //         for (var _data in $data) {
            //             var __data = $data[_data];
            //             __data = new SPMap.Point(__data.lng, __data.lat);
            //         }
            //     }
            //     else if ($data instanceof Object) {
            //         $data = new SPMap.Point($data.lng, $data.lat);
            //     }
            // }

            return this;
        },
        /**
         * @desc CacheLayer
         * @param option {
         *     name:
         *     type: point/line/surface/img/circle/tiles/label/grid
         *     respone/data:
         *     estyle:{}
         *     option:{}
         * }
         */
        cl:function (option) {
            if (jQuery.isEmptyObject(option)) {
                throw  new Error("option is Empty Object");
            }
            if (!option.name || option.name == '') {
                throw  new Error("layer name does not exist");
            }
            if (!option.type || option.type == '') {
                throw  new Error("layer type does not exist");
            }
            if (!(option.type in $c.ge)) {
                throw  new Error("this type is not surported.");
            }
            le.bind(this)();
            this._name = option.name;
            this._type = option.type;
            this._cls = 'cache';
            this._estyle = (new __c()).estyle(option);
            this._option = (new __c()).option(option.type,option.astyle,option.event);
            if (option.data) {
                this._lc = $c.ui();
                (new __d).ext(option.data, this._lc);
            }
            else if (option.request) {
                this._lc = option.request.getResponseHeader('cid');
                (this._method = option.request.getResponseHeader('mrd')) == 'command' && (new $r({L: this._lc}, 2));
            };
            return this;
        },
    }

    /**
     * @desc spm.Data
     * @param data
     * @param type
     * @param option estyle
     * @returns {Array}
     */
    var __d=function () {

    }
    __d.prototype.set=function(data,type,estyle) {
        var mpd = [];
        if (data.points && data.points.length > 0) {
            $.each(data.points, function () {
                var j = {};
                if (type == 'point' || type == 'image' || type == 'grid' || type == 'label') {
                    j.geometry = {
                        type: 'Point',
                        coordinates: [this.POINTS.lng, this.POINTS.lat]
                    }
                }
                else if (type == 'mline' || type == 'surface') {
                    var md = [];
                    $.each(this.POINTS, function () {
                        md.push([this.lng, this.lat]);
                    })
                    if(type == 'mline') {
                        if (md[0] != md[md.length - 1]) {
                            md.push(md[0]);
                        }
                    }
                    j.geometry = {
                        type: type == 'mline' ? "MultiLineString" : "Polygon",
                        coordinates: [md]
                    }
                }
                else if(type == 'line') {
                    var md = [];
                    $.each(this.POINTS, function () {
                        md.push([this.lng, this.lat]);
                    })
                    j.geometry = {
                        type: "LineString",
                        coordinates: md
                    }
                }

                if (this.DEG) {
                    j.deg = this.DEG;
                    delete  this.DEG;
                }
                if (estyle && this.VALS) {
                    var vl=this.VALS;
                    $.each(estyle, function () {
                        var v = _c.getDefv(this,vl);
                        if (v.style) {
                            $.extend(j,v.style);
                            // for (var s in v.style) {
                            //     var f = _c.field(v.style[s]);
                            //     j[f] = v.val;
                            // }
                        }
                    })
                }
                delete  this.POINTS, delete  this.CP, delete  this.VALS;delete  this.LOCATIONS;
                if(this.contexts) {
                    j.contexts=this.contexts;
                    // for (var _v in this.contexts) {
                    //     var c = this.contexts[_v];
                    //     for (var _c in c) {
                    //         j[_c] = c[_c];
                    //     }
                    // }
                }
                mpd.push(j);
            });
            delete  data.points;
        }
        return mpd;
    }
    __d.prototype.getCacheData=function (o,b,t,callback) {
        var _this=this;
        if(t=='init') {
            (new $r({L: o._lc, R: b, T: t}, 1, function (data) {
                if (callback && typeof  callback === 'function') {
                    if (data.points) {
                        callback(_this.set(data, o._type, o._estyle));
                    }
                    else if (data.cp) {
                        callback(data);
                    }
                }
            }))
            return;
        }

        var datas = [];
        var n=0;
        var gb = (new __c()).groupBound(b, 2);
        if(!gb||gb.length==0)
            return;
        var l=gb.length;
        for(var _b in gb) {
            var __b=gb[_b];
            var r = __b.sw.lng + ',' +__b.sw.lat + ',' + __b.ne.lng + ',' + __b.ne.lat;
            new $r({L: o._lc, R: r, T: t},'get'+_b,function (data) {
                if (data.points) {
                    a(new _this.set(data, o._type,o._estyle))
                }
                _n()
            })
        }

        var time=setInterval(function () {
            if (n == l) {
                clearInterval(time);
                if (callback && typeof  callback === 'function') {
                    if (datas.length > 0) {
                        callback(datas);
                    }
                    else if (datas.cp) {
                        callback(datas);
                    }
                }
            }
        },10)

        function a(_d) {
            Array.prototype.push.apply(datas,_d);
        }

        function _n() {
            n++;
        }
    }
    __d.prototype.updateCache=function (e) {
        var m = $c.gM(e);
        if (m) {
            var ne = m.getBounds().getNorthEast();
            var sw = m.getBounds().getSouthWest();
            var _this=this;
            $.each(m.sLY, function () {
                if (this instanceof SPMap.CacheLayer) {
                    var __this = this;
                    _this.getCacheData(this, {sw: sw, ne: ne}, 'ud',function (data) {
                        var d = mgv.get.Layer(m, __this._lc);
                        if (d) {
                            d.dataSet.set(data);
                        }
                        else {
                            var _m = new mgv.SPLayer(m, data, __this);
                        }
                    })
                }
            })
        }
    }
    __d.prototype.ext=function (data,id) {
        if (!data || data.length == 0)
            return;
        var c = id,n = 0;
        setTimeout(function () {
            var gc = gp(data, 5000);
            var i = 0;
            for (; i < gc.length; i++) {
                f({data: gc[i], cid: c});
            }
            var k = setInterval(function () {
                if (n == gc.length) {
                    //合成
                    clearInterval(k);
                    $r({L:c},5);
                }
            }, 50)
        },10);

        function f(caches) {
            setTimeout(function () {
                new $r(caches,4,function () {
                    a();
                })
                // $.ajax({
                //     type: 'post',
                //     url: '/userperce/MapCaches/extentCache',
                //     contentType : 'application/json;charset=utf-8',
                //     dataType:"json",
                //     data: JSON.stringify(caches),
                //     success: function (tag) {
                //         a();
                //     },
                //     error: function () {
                //
                //     }
                // })
            },20)
        }

        function a() {
            n++;
        }

        function gp(data, cnt) {
            var result = [];
            var groupItem;
            for (var i = 0; i < data.length; i++) {
                if (i % cnt == 0) {
                    groupItem != null && result.push(groupItem);
                    groupItem = [];
                }
                groupItem.push(data[i]);
            }
            result.push(groupItem);
            return result;
        }
    }


    /**----Common instance-----**/
    var __c=function () {
    }
    /**
     * @param {Array<Object>|Object} data
     */
    __c.prototype.getDataBound=function (data) {
        // if(!this.bound)
        // {
        //     return this.bound={en:data,ws:data};
        // }
        // if(data.lng>this.bound.ws.lng)
        // {
        //     this.bound.ws.lng=data.lng;
        // }
        // if(data.lng>this.bound.ws.lng)
        // {
        //     this.bound.ws.lng=data.lng;
        // }
        // if(data.lng>this.bound.ws.lng)
        // {
        //     this.bound.ws.lng=data.lng;
        // }
        // if(data.lng>this.bound.ws.lng)
        // {
        //     this.bound.ws.lng=data.lng;
        // }
        if (data instanceof Array) {
            var b = {
                sw: {
                    lng: Math.min.apply(Math, data.map(function (a) {return a.lng})),
                    lat: Math.min.apply(Math, data.map(function (a) { return a.lat }))
                },
                ne: {
                    lng: Math.max.apply(Math, data.map( function (a) { return a.lng })),
                    lat: Math.max.apply(Math, data.map(function (a) { return a.lat }))
                }
            }
            b.cp = this.getCenter(b.sw,b.ne);
            return b;
        }
        else if (data instanceof Object) {
            return {cp: data};
        }
    }
    /**
     *
     * @param bound {sw:,ne}
     * @param gpn
     */
    __c.prototype.groupBound=function(bound,gpn) {
        var _gpn =Math.pow(2,2*(gpn-1)) || 1;// ;
        var _g=g(bound);
        if(_gpn==1)
            return _g;
        var gps=[];
        var __gpn = 0;
        f(_g);
        function f(_bound) {
            if (_bound instanceof Array) {
                gps = [];
                __gpn = 0;
                for (var k in _bound) {
                    Array.prototype.push.apply(gps, g(_bound[k]));
                    __gpn++;
                }
                if (__gpn < _gpn) {
                    f(gps);
                }
                else {
                    return;
                }
            }
        }

        function g(_bound) {
            var _c={lng: (_bound.sw.lng + _bound.ne.lng) / 2, lat: (_bound.sw.lat + _bound.ne.lat) / 2};
            return [
                {sw: {lng: _bound.sw.lng, lat: _c.lat}, ne: {lng: _c.lng, lat: _bound.ne.lat}},
                {sw: {lng: _c.lng+0.0000001, lat: _c.lat}, ne: {lng: _bound.ne.lng, lat: _bound.ne.lat}},
                {sw: {lng: _bound.sw.lng, lat: _bound.sw.lat}, ne: {lng: _c.lng, lat: _c.lat-0.0000001}},
                {sw: {lng: _c.lng+0.0000001, lat: _bound.sw.lat}, ne: {lng: _bound.ne.lng, lat: _c.lat-0.0000001}}
            ]
        }
        return gps;
    }
    __c.prototype.getDefv=function (d,v) {
        var _this = this;
        if (d.type == 'range') {
            var v1 = parseFloat(v);
            $.each(d.iv, function () {
                var k = this.item, v2 = this.ranges[0], v3 = this.ranges[1];
                if (k.indexOf('(') >= 0 && k.indexOf(')') > 0) {
                    if (v1 > v2
                        && v1 < v3) {
                        _this = this;
                        return false;
                    }
                }
                else if (k.indexOf('(') >= 0 && k.indexOf(']') > 0) {
                    if (v1 > v2
                        && v1 <= v3) {
                        _this = this;
                        return false;
                    }
                }
                else if (k.indexOf('[') >= 0 && k.indexOf(')') > 0) {
                    if (v1 >= v2
                        && v1 < v3) {
                        _this = this;
                        return false;
                    }
                }
                else if (k.indexOf('[') >= 0 && k.indexOf(']') > 0) {
                    if (v1 >= v2
                        && v1 <= v3) {
                        _this = this;
                        return false;
                    }
                }
            })
        }
        else if (d.type == 'single') {
            $.each(d.iv, function () {
                if (this.item == v) {
                    _this = this;
                    return false;
                }
            })
        }
        return _this;
    }
    __c.prototype.field=function (field) {
        switch (field) {
            case  'fclr':
                return 'fillStyle';
            case  'eclr':
                return 'strokeStyle';
            case  'alpha':
                return 'globalAlpha';
            case  'ewidth':
                return 'lineWidth';
            case  'sdclr'://投影模糊级数
                return 'shadowColor';
            case  'sdblur':
                return 'shadowBlur';
            // case  'event':
            //     return 'methods';
            case  'img':
                return 'icon';
            default:
             return field;
             //size、zIndex、coordType（bd09mc/bd09ll）/height/width lineDash[5,10]

        }
    }
    __c.prototype.estyle=function (option) {
        var _self=this;
        if (option.estyle) {
            $.each(option.estyle, function () {
                var _this = this;
                $.each(this.iv, function () {
                    if (_this.type == 'range') {
                        this.ranges = g(this.item);
                    }
                    var __this=this;
                    $.each(this.style, function (a, b) {
                        if ('img' == a) {
                            var _img = new Image();
                            _img.src = this.img;
                            __this.style.icon =_img;
                            delete  __this.style.img;
                        }
                        else {
                            var s=_self.field(a);
                            if(s!=a) {
                                __this.style[s] = b;
                                delete  __this.style[a];
                            }
                        }
                    })

                })
            })
        }

        function g(s) {
            var sp = s.split(',');
            if (sp.length == 2) {
                return [parseFloat(sp[0].replace(/[^0-9]/ig, "")), parseFloat(sp[1].replace(/[^0-9]/ig, ""))];
            }
            else {
                throw  new Error(s + ' is not range');
            }
        }
    }
    __c.prototype.option=function (type,option,event) {
        var _option = option || {};
        if (type == "image" && _option.img) {
            var m = new Image();
            m.src = _option.img;
            _option.img = m;
            _option.draw = 'icon';
        }
        else if (type == 'point' || type == "line" || type == "surface") {
            _option.draw = 'simple';
        }
        else if (type == 'text') {
            _option.draw = 'text';
        }
        else if (type == 'tiles') {
            _option.draw = 'tiles';
        }
        else if (type == 'grid') {
            _option.draw = 'grid';
            _option.unit='m';
        }
        //event
        if(event) {
            _option.methods = {};
            $.each(event, function () {
                if (this) {
                    var n = this;
                    if (!(n in $c.rm))  //要在地图实例bindEvent事件
                        return;
                    var _rm = $c.rm[n];
                    _rm.cnt =_rm.cnt? _rm.cnt + 1:1;//事件数
                    //在地图实例bindEvent事件
                    _option.methods[n] = function (item, e, ly) {//e.type,onrightclick
                        var name = $c.gC(_rm._e, ly);
                        if (!name)
                            return;

                        if (!_rm.tid) {
                            _rm.count = 0;
                            _rm.tid = setInterval(function () {
                                if (_rm.cnt == _rm.count) {
                                    clearInterval(_rm.tid);
                                    delete  _rm.tid;
                                    if (_rm.cb && typeof  _rm.cb == 'function') {
                                        _rm.cb({data: _rm._data, offset: _rm._offset,_e:_rm._e});
                                    }
                                }
                            }, 10)
                        }

                        _rm._offset = {x: e.offsetX, y: e.offsetY};
                        (!_rm._data) && (_rm._data = {});
                        (!(name in _rm._data)) && (_rm._data[name] = []);
                        if (item) {
                            for (var _item in item) {
                                var $d = {};
                                var im=item[_item];
                                for (var _data in im) {
                                    var __item = im[_data];
                                    if (_data == 'geometry') {
                                        $d.point =  __item.coordinates ;
                                        $d.pixel = __item._coordinates;
                                    }
                                    else if (_data=='contexts') {
                                        $d[_data] = __item;
                                    }
                                }
                                _rm._data[name].push($d);
                            }
                        }
                        _rm.count += 1;
                    }
                }
            })
        }

        var j = {};
        for (var _p in _option) {
            j[this.field(_p)] =_option[_p];
        }
        return j;
    }
    __c.prototype.fullview=function (p,c) {
        new $r(p, 3, function (data) {
            if (c && typeof  c == 'function') {
                c(data)
            }
        })
    }
    __c.prototype.getCenter=function (sw,ne) {
        var _p = new BMap.MercatorProjection().lngLatToPoint(new BMap.Point(sw.lng, sw.lat));
        var __p = new BMap.MercatorProjection().lngLatToPoint(new BMap.Point(ne.lng, ne.lat));
        var x = (_p.x + __p.x) / 2;
        var y = (_p.y + __p.y) / 2;
        return new BMap.MercatorProjection().pointToLngLat(new BMap.Pixel(x, y));
    }
    __c.prototype.boundZoom=function (m,b) {
        if (!b || !b.sw || !b.ne)
            return;
        var zoom = ["20", "50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。
        var distance = m.getDistance(new BMap.Point(b.sw.lng, b.sw.lat), new BMap.Point(b.ne.lng, b.ne.lat)).toFixed(1);
        for (var i = 0; i < zoom.length; i++) {
            if (zoom[i] - distance > 0) {
                var z = 18 - i + 3;
                return z < 15 ? 15 : z > 18 ? 18 : z;
            }
        }
    }

    /**
     *
     * @param option menu:[text,cfb(curtxt,paretxt),sub],maxcnt,elem   addto sLY ;add rkcode hide disable property
     * @private
     */
    var __r=function (option) {
        if(!option)
            return;

        if (!$c.js(5)) {
            $c.aJ(5, function () {
                return new aOn.rK(option);
            })
        }
        else {
            return new aOn.rK(option);
        }

    }
    /**
     *
     * @param item
     * @param level 0,1... level null=-1
     */
    __r.prototype.append=function (item,level) {

    }
    __r.prototype.hide=function (text,level) {
        
    }
    __r.prototype.disable=function (text,level) {
        
    }

    /**
     * _offset{x,y},menu
     */
    __r.prototype.show=function (e) {
        $('.'+e._e+'-menu').remove();
        document.addEventListener("click", function(e) {
            if(e.target.parentNode&&e.target.parentNode.id&&
                (e.target.parentNode.id=='r-down-menu-item'||
                    e.target.parentNode.id=='r-up-menu-item'||
                    (e.target.className=='menu-item-name'&& e.target.id==""))
            )
                return;

            $(".web-context-menu").remove();
        });
        var  _my=this;
        var st=setInterval(function () {
            if(_my.Menu)
            {
                clearInterval(st);
                var _of = e._offset;
                var _mu = _my.Menu;
                if (!_of || !_mu)
                    return;

                // document.addEventListener("click", function (e) {
                //     if (e.target.parentNode && e.target.parentNode.id &&
                //         (e.target.parentNode.id == 'r-down-menu-item' ||
                //             e.target.parentNode.id == 'r-up-menu-item' ||
                //             (e.target.className == 'menu-item-name' && e.target.id == ""))
                //     )
                //         return;
                //
                //     $(".web-context-menu").remove();
                // });
                // $(".web-context-menu").remove();
                if (!id || id === "body")
                    $('body').append(_mu)
                else
                    $("#" + id).append(_mu);
                _mu.style.display = "block";
                _mu.style.position = "absolute";
                var x = event.offsetX;
                var y = event.offsetY;
                // var x = event.clientX;
                // var y = event.clientY;
                // 调整菜单出现位置，防止菜单溢出浏览器可视区域
                if (y + _mu.clientHeight * 1 > window.innerHeight) {
                    y -= _mu.clientHeight * 1;
                }
                if (x + _mu.clientWidth * 1 > window.innerWidth) {
                    x -= _mu.clientWidth * 1;
                }
                _mu.style.left = x + "px";
                _mu.style.top = y + "px";
            }
        },10)
    }

    var $c = {
        mv: {},//[e]=object :sEM ,sID,sLY[layername]=parameter,sEV={}
        gc: Math.random().toString(16).replace(".", ""),
        gO: function (e) {//get object
            return (e in this.mv) && this.mv[e];
        },
        gM: function (e) {//get map
            var o = this.gO(e);
            if (o) {
                return o.sEM;
            }
        },
        gL: function (e, l) {//get layer
            var o = this.gO(e);
            if (o) {
                return o.sLY[l];
            }
        },
        gC: function (e, c) {//get layername from  code
            var o = this.gO(e);
            if (o) {
                var _c;
                $.each(o.sLY, function (a, b) {
                    if (this._lc == c) {
                        _c = a;
                        return false;
                    }
                })
                return _c;
            }
        },
        /**public
         * get map instance(null) or layer
         * @param {String}  e
         * @param [String] l
         * @returns {*}
         */
        gt: function (e, l) {//outer
            var o = this.gO(e);
            if (o) {
                if (l) return o.sLY[l];
            }
            return o.prototype;
        },
        aL: function (l) {//add layer
            this.gO(l._e).sLY[l._name] = l;
        },
        pJ: ["SPMLib", 'mgv', 'modeules', 'component', 'coordSysModel','addOn'],
        dm:
            {
                p: document.location.pathname.split('/')[1],
                u: document.location.origin,
                n: ["update", 'get', 'run', 'fv', 'extCe', 'extCeS'],
                r: function (n) {
                    if (typeof n == 'string') {
                        return '/' + this.p + '/MapCaches/' + n;
                    }
                    return '/' + this.p + '/MapCaches/' + this.n[n];
                }
            },
        ge: {point: 0, line: 1, surface: 2, image: 3, circle: 4, tiles: 5, label: 6, grid: 7},
        tl: [{
            tip: '放大地图',
            lock: false,
            style: '../../spmv/image/zoom-out-off.png',
            onstyle: '../../spmv/image/zoom-out-on.png'
        }, {
            tip: '缩小地图',
            lock: false,
            style: '../../spmv/image/zoom-in-off.png',
            onstyle: '../../spmv/image/zoom-in-on.png'
        }, {
            tip: '拉框放大',
            lock: false,
            style: '../../spmv/image/rect-out-off.png',
            onstyle: '../../spmv/image/rect-out-on.png'
        },
            {
                tip: '拉框缩小',
                lock: false,
                style: '../../spmv/image/rect-in-off.png',
                onstyle: '../../spmv/image/rect-in-on.png'
            }, {
                tip: '测量长度',
                lock: false,
                style: '../../spmv/image/measure-length-off.png',
                onstyle: '../../spmv/image/measure-length-on.png'
            },
            {
                tip: '测量面积',
                lock: true,
                style: '../../spmv/image/measure-area-off.png',
                onstyle: '../../spmv/image/measure-area-on.png'
            }, {
                tip: '清除图层',
                lock: false,
                style: '../../spmv/image/clear-lyr-off.png',
                onstyle: '../../spmv/image/clear-lyr-on.png'
            }, {
                tip: '地址查询',
                lock: true,
                style: '../../spmv/image/address-query-off.png',
                onstyle: '../../spmv/image/address-query-on.png'
            },
            {
                tip: '位置定位',
                lock: true,
                style: '../../spmv/image/location-pos-off.png',
                onstyle: '../../spmv/image/location-pos-on.png'
            }
        ],
        gp: function (data, cnt) {
            var result = [];
            var groupItem;
            for (var i = 0; i < data.length; i++) {
                if (i % cnt == 0) {
                    groupItem != null && result.push(groupItem);
                    groupItem = [];
                }
                groupItem.push(data[i]);
            }
            result.push(groupItem);
            return result;
        },
        ui: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16).replace(/-/g, '');
            });
        },
        js: function (j) {
            j = this.pJ[j] + '.js';
            var js = /js$/i.test(j);
            var es = document.getElementsByTagName(js ? 'script' : 'link');
            for (var i = 0; i < es.length; i++)
                if (es[i][js ? 'src' : 'href'].indexOf(j) != -1) return true;
            return false;
        },
        aJ: function (j, c) {
            $.getScript('../../spmv/mjs/' + this.pJ[j] + '.js', function (r, s) {
                if (s == 'success' || s == 'notmodified') {
                    c();
                }
            })
        },
        rm: {}
    }


    //开放接口
    exports.Map=m;
    exports.Point=p;
    exports.hasLoad=l;
    exports.DataLayer=__l.dl;
    exports.CacheLayer=__l.cl;
    exports.Get=$c.gt;
    exports.RMenu=__r;
    Object.defineProperty(exports, '__esModule', {value: true});
})));
