(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.SPMap = global.SPMap || {})));
}(this, (function (exports) {
    'use strict';
    /**
     *
     * @param mElem
     * @param {object} option {tools:{},staues{},bussess{}}
     * @constructor
     */
    var m =function (mElem,option) {
        this._e = mElem;
        this._p = option;
        this._c=$c.gc;
        if ($("#" + this._e).length == 0)
            return;
        if(option) {
            if (option.status) {
                statueDom(this._c, option.status)
            }
            if (option.tools) {
                toolsDom(this._c, option.tools)
            }
            if (option.bussess) {
                toolsDom(this._c, option.bussess)
            }
        }

        //保存实例
        return this;
    }

    /**
     * map:{},
     * @param mCity
     */
    m.prototype.map = function (mCity) {
        $("#" + this._e).append("<div class='basemap' id='" + this._c + "'></div>")
        try {
            this._m = new BMap.Map(this._c, {
                minZoom: 9,
                maxZoom: 19,
                enableMapClick: false
            });
        }
        catch (e) {
            throw  new Error('加载地图失败.' + e.message)
        }
        this._m.disableScrollWheelZoom();
        this._m.disableDoubleClickZoom();
        this. _m.enableKeyboard();
        this._m.disableContinuousZoom();
        this._m.setDefaultCursor('auto');
        var mc = mapv.utilCityCenter.getCenterByCityName(mCity);
        if (mc == null) {
            mCity = '昆明';
        }
        this._m.centerAndZoom(mCity, 17);
        $c.am(elem,this);
    }

    m.prototype.get = function (mid) {
        return Map.get(mid);
    }

    m.prototype.bindEvent=function () {
        
    }


   m.prototype.addLabel = function () {

    }
    m.prototype.addLayer = function () {

    }
    m.prototype.addGeoLayer = function () {

    }

    m.prototype.addLegend = function () {

    }

    /**
     * @description 移动并标识
     * @param {Object} point {lng,lat}
     * @param [Object]{coord:wgs/默认为bd,distimer:消失时间(ms)} option
     */
    m.prototype.panAndFlag=function (point,option) {
        if(!point||!point.lng||!point.lat)
            return;
        var img = new Image();
        img.src = '../../images/map/symbols/mark_r.png';
        var p=option&&option.coord&&option.coord=='wgs'?coordtransform.wgs84tobd09(point.lng,point.lat):point;
        var md = new mapv.DataSet([
            {
                geometry: {
                    type: 'Point',
                    coordinates: [p.lng, p.lat]
                }, icon: img
            }
        ]);
        var map = new mapv.baiduMapLayer(_map, md, {
            draw: 'icon',//
            height: 64,
            mcode: 'pan-flag'
        });
        _map.panTo(new BMap.Point(p.lng, p.lat));
        if (option&&option.distimer) {
            var t = setInterval(function () {
                $Layer.removeLayer("pan-flag")
                clearInterval(t)
            }, (option.distimer + 500))
        };
    }


    /**----------------------function-----------------------**/
    /**
     *
     * @param id
     * @param option {label:true,html:html,info}
     */
    function statueDom(id,option) {
      var elem=$('#'+id).append("<div class=\"map-status\">\n" +
            "<span>\n" +
            "<div class=\"lon-lat-label\" id=\"lon-lat-label-id\">0.000000  0.000000</div>\n" +
            "<div class=\"vertical-line\"></div>\n" +
            "<div class=\"zoom-class-label\" id=\"zoom-class-label-id\">等级</div></span></div>");
        if (option.label == true) {
            $('#m-map-id .map-status span').append("<div class=\"vertical-line\"></div><div class=\"sel-info-btn\" id=\"sel-info-btn-id\"></div>")
        }
        if (option.html) {
            $('#m-map-id .map-status span').append("<div class=\"vertical-line\"></div>" + option.html);
        }
        if (option.maptip == true) {
            $('#m-map-id .map-status span').append("<div class=\"vertical-line\"></div><div class=\"map-date-label\" id=\"map-date-label-id\"> </div>")
        }

    }

    /**
     *option {item:['default','qeurylocation','zoomin','zoomout','recin','recout','measure','clear']},
     * custom:[{idx:,url:title,enable,cbfun,sub:[]}]
     */
    function toolsDom(id,option) {
        var q = $('#'+id).append("<div class=\"map-tools\" style=\"top:15px\"><div class=\"map-tools-panel\"></div></div>");
        for (var k in option) {
            if (k == 'item') {
                var v = option[k];
                if ($.inArray("default", v) >= 0) {
                    v = ['qeurypos', 'zoomin', 'zoomout', 'recin', 'recout', 'measure', 'clear']
                }
                var i = 0;
                for (; i < v.length; i++) {
                    var ii = v[i];
                    switch (ii) {
                        case  'qeurypos':
                            adddom(ii, function () {
                                $('#' + id + " .map-position").remove();
                                $('.dd').append("<div class=\"map-position\" id=\"map-position-id\"><H4><label class=\"p-label\" id=\"p-label-id\" style=\"height: 20px;margin-left:5px;\">地图搜索</label></H4><input  class=\"p-content-cancel\"  type=\"button\"  value=\"×\" title=\"关闭\"/><div class=\"line-split\" > </div><div class=\"p-content\"><label class=\"p-content-label\">内容</label><input class=\"p-content-text\" focusplaceholder=\"经纬度/地址\" type=\"text\" value=\"\"/></div><div class=\"p-content\" style=\"margin-top:5px;margin-bottom: 5px;\"><input class=\"p-content-ok\" type=\"button\" value=\"搜索\"/></div></div>");
                                $('.map-position .p-content-cancel').click(function () {
                                    $('.map-position').fadeOut(200);
                                })
                                $('.map-position .p-content-ok').click(function () {
                                    if (searh() == true)
                                        $('.map-position').fadeOut(200);
                                })
                            });
                            break;
                        case  'zoomin':
                            adddom(ii, function () {
                                var _m=$c.gm(id)._m;
                                _m.zoomIn();
                            });
                            break;
                        case  'zoomout':
                            // $('#m-map-id .map-tools-panel').append("<a  class=\"tools-box zoom-out\" id='zoom-out-id' ></a>");
                            // $('#adress-pos-id').hover(function () {
                            //     $('#adress-pos-id').addClass('zoomout-img')
                            // },function () {
                            //     $('#adress-pos-id').removeClass('zoomout-img')
                            // })
                            // $('#adress-pos-id').click(function (e) {
                            //
                            // })
                            adddom(ii, function () {
                                var _m=$c.gm(id)._m;
                                _m.zoomOut();
                            });
                            break;
                        case  'recin':
                            //加载js
                            adddom(ii, function () {
                                reczoom(0);
                            });
                            break;
                        case  'recout':
                            //加载js
                            adddom(ii, function () {
                                reczoom(1);
                            });
                            break;
                        case  'measure':
                            adddom(ii, function () {
                                measure();
                            });
                            break;
                        case  'clear':
                            adddom(ii, function () {

                            });
                            break;
                    }
                }
            }
            if (k == 'custom') {

            }
        }

        /***
         * add dom tree
         * @param n
         * @param f
         */
        function adddom(n, f) {
            $('#m-map-id .map-tools-panel').append("<a  class=\"tools-box " + n + "\"></a>");
            var k = $('#m-map-id .map-tools-panel a:last-child');
            k.hover(function () {
                $(this).addClass(n + '-img')
            }, function () {
                $(this).removeClass(n + '-img')
            })
            k.click(function (e) {
                f(e);
            })
        }

        /**
         * search for location or address
         */
        function searh() {
            var _mp = $c.gm('.map-position');
            if (!_mp)
                return false;
            var fo = $(".p-content-text").val().trim();
            if (fo.length == '')
                return false;
            var sp = fo.trim().split(",");
            if (sp.length == 2 && $isNum(sp[0]) && $isNum(sp[1])) {
                if ($lonlat(sp[0], sp[1])) {
                    _mp.panAndFlag({lng: sp[0], lat: sp[1]})
                    return true;
                }
            }
            else {
                var _g = new g();
                _g.coder(_mp._m, fo, function (rs) {
                    //a.push({location: poi.point, title: poi.title, address: poi.address});
                    if (rs) {
                        sads(rs);
                        return true;
                    }
                })
            }
            return false;

            function sads(data) {
                $('#map-address-poi-id').remove();
                $('.DD').append("<div class=\"map-address-poi\" id='map-address-poi-id'>" +
                    "<h4 style='text-align: left'><label  style=\"height: 10px;\">地址查询</label></h4>" +
                    "<input  class=\"p-content-cancel\" type=\"button\" value=\"×\" title=\"关闭\"/><div class=\"line-split\" > </div><div id=\"set-address-poi-id\"></div></div>");

                var header = [
                    {'field': 'title', 'title': '名称', 'width': '200', style: 'cursor: pointer;color:#85EFFF;'},
                    {'field': 'address', 'width': '300', 'title': '地址'}
                ]
                commdiv.$worker({
                    elem: 'set-address-poi-id', fields: header, data: data, clkevt: {
                        idx: 0, name: 'clkname', cbfun: function (rsl) {
                            _mp.panAndFlag({lng: rsl.point.lng, lat: rsl.point.lat});
                        }
                    }, height: 355, width: 600, skin: 'line'
                })
                commdiv.$setDragDiv('map-address-poi-id', 'mypoidrag');
                $("#map-address-poi-id").css('display', 'block');
            }
        }


        function reczoom(t) {
            var s = true;
            if (s) {
                if (ztype == zt) {
                    r.close();
                    r = null;
                }
            }
            else {
                r = new BMapLib.RectangleZoom(basemap.mapvw, {
                    zoomType: t,
                    strokeWeight: 1,
                    strokeColor: 'red',
                    followText: '点击图标关闭',
                    opacity: 0.8,
                    autoClose: false
                });
                r.open();
            }
        }

        function clear() {

        }

        function measure() {
            var  mdis=new MeasureTool.distance(basemap.mapvw);
            mdis.open();
        }
    }

    function  addmapDom(t) {
        if(t=='staues')
        {

        }
        else if(t=="position")
        {

        }
        else if(t=="addresspoi")
        {

        }
    }
    /**---------------------------------------------**/

    /**
     * key id value map
     * @type {{}}
     */
  //var  mapv = {};

    /**
     * @summary 标注
     * @type {SPMap.Label}
     */
    var Label = function () {
        Map.bind(this)();
    }


    /**
     *
     * @type {SPMap.Legend}
     */
    var Legend = function () {
    }

    /**
     *
     * @type {SPMap.Layer}
     */
    var Layer = function () {

    }

    /**
     *
     * @constructor
     */
    var Tool = function (options) {
        var _dom = document.createElement('div');
        _dom.setAttribute('class', 'map-tools');
        var ar = [];
        var _sub = [];
        if (options.QUERY_CELL) {
            _sub.push({
                url: "../../images/map/tools/cell-pos.png",
                callback: function (e) {
                    maptool.position_open(0, e);
                },
                text: '小区查询'
            })
        }
        if (options.QUERY_GRID) {
            _sub.push({
                url: "../../images/map/tools/cell-pos.png",
                callback: function (e) {
                    maptool.position_open(0, e);
                },
                text: '栅格查询'
            })
        }
        if (options.QUERY_LNGLAT) {
            _sub.push({
                url: "../../images/map/tools/lnglat-pos.png",
                callback: function (e) {
                    maptool.position_open(2, e);
                },
                text: '经纬度定位'
            })
        }
        if (options.QUERY_ADDRESS) {
            _sub.push({
                url: "../../images/map/tools/adress-pos.png",
                callback: function (e) {
                    maptool.position_open(3, e);
                },
                text: '地址解析'
            })
        }
        if (_sub.length > 0) {
            ar.push({
                    url: "../../images/map/tools/querymap.png",
                    mbLayer: _sub,
                    title: '地图搜索'
                }
            )
        }
        if (options.ZOOMOUT) {
            ar.push(
                {
                    url: "../../images/map/tools/zoom-out.png",
                    callback: function (e) {
                        maptool.zoomout(e);
                    },
                    title: '放大地图',
                    enabled: true,
                    unselected: true
                }
            )
        }
        if (options.ZOOMIN) {
            ar.push({
                    url: "../../images/map/tools/zoom-in.png",
                    callback: function (e) {
                        maptool.zoomin(e);
                    },
                    title: '缩放地图',
                    enabled: true,
                    unselected: true
                }
            )
        }
        if (options.REC_OUT) {
            ar.push({
                    url: "../../images/map/tools/rec-zoomout.png",
                    callback: function (e) {
                        maptool.rec_zoomout(e, -1);
                    },
                    title: '拉框放大',
                    enabled: true
                }
            )
        }
        if (options.REC_IN) {
            ar.push({
                    url: "../../images/map/tools/rec-zoomin.png",
                    callback: function (e) {
                        maptool.rec_zoomout(e, 1);
                    },
                    title: '拉框缩小', enabled: true
                }
            )
        }
        if (options.MEASURE) {
            ar.push({
                    url: "../../images/map/tools/measure.png",
                    callback: function (e) {
                        maptool.measure_open(e);
                    },
                    title: '测量距离', enabled: true
                }
            )
        }
        if (options.CLEARLYR) {
            ar.push({
                    url: "../../images/map/tools/clearlayer.png",
                    callback: function (e) {
                        var m = new UCMap.UCLoctions();
                        m.clearLayer();
                    },
                    title: '清除样式',
                    enabled: true,
                    unselected: true
                }
            )
        }
        if (options.LYR_MANAGE) {
            ar.push(
            )
        }
        return {_dm:_dom,_bs:ar};
    }

    /**
     *
     * @type {{QUERY_CELL: string, QUERY_GRID: string, QUERY_LNGLAT: string, QUERY_ADDRESS: string, ZOOMIN: string, ZOOMOUT: string, REC_IN: string, REC_OUT: string, MEASURE: string, CLEARLYR: string, LYR_MANAGE: string}}
     */
    Tool.prototype.options = {
        QUERY_CELL: 'qc',
        QUERY_GRID: 'qg',
        QUERY_LNGLAT: 'ql',
        QUERY_ADDRESS: 'qa',
        ZOOMIN: 'zi',
        ZOOMOUT: 'zo',
        REC_IN: 'ri',
        REC_OUT: 'ro',
        MEASURE: 'ms',
        CLEARLYR: 'cl',
        LYR_MANAGE: 'lm'
    }

    var ab = function (bussbox, selector) {
        if (!bussbox)
            return;
        var selectid = $(selector);
        if (!selectid || selectid.length == 0)
            return;
        $(selector + '.mtool-box').remove();
        $.each(bussbox, function (a, b) {
            $(selector).append(
                "<div class=\"mtool-box\" id='" + Math.random().toString(8).replace(".", "") + "' enabled='" + (b.enabled ? b.enabled : false) + "' unselected='" + (b.unselected ? b.unselected : false) + "'><i></i>\n" +
                "<ul class=\"mtool-nav\" >\n" +
                "    <li class=\"mtool-nav-item\" >\n" +
                "        <div  class=\"mtool-header mh" + a + "\">\n" +
                "            <a href=\"javascript:;\"></a>\n" +
                "        </div>\n" +
                "        <dl class=\"mtool-nav-child  mtool-hide\" statue='0'>\n" +
                "        </dl>\n" +
                "    </li>\n" +
                "</ul>\n" +
                "</div>"
            );
            if (b.url) {
                $(selector + ' .mtool-header a:last').append("<img src='" + b.url + "' class=\"mtool-nav-img\">")
            }
            $(selector + ' .mtool-header a:last').text(b.text);
            if (b.callback && typeof b.callback == "function") {
                $(selector + ' .mtool-box:last').on('click', function (e) {
                    basemap.setBoxStatue(e, 1);
                    b.callback(e);
                });
                $(selector + ' .mtool-box:last').css('cursor', 'pointer')
                $(selector + ' .mtool-box a:last').css('cursor', 'pointer')
            }
            if (b.title) {
                commdiv.$addMoveTip(b.title, selector + ' .mh' + a, 1);
            }
            if (b.mbLayer && b.mbLayer.length > 0) {
                $(selector + ' .mtool-box:last').attr('enabled', 'true')
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
                        "<dd  class=\"md" + c + "\" id='" + Math.random().toString(8).replace(".", "") + "' enabled='" + (d.enabled ? d.enabled : false) + "' unselected='" + (d.unselected ? d.unselected : false) + "'><i></i>" + (d.url ? "<img src='" + d.url + "'/>" : "") + "<a href=\"javascript:;\"><i>&nbsp; </i>" + d.text + "</a></dd>")
                    if (d.callback && typeof d.callback == "function") {
                        $(selector + ' .mtool-nav-item dd:last').on('click',
                            function (e) {
                                basemap.setBoxStatue(e, 1);
                                d.callback(e)
                                console.log(this);
                            }
                        );
                    }
                    if (d.title) {
                        commdiv.$addMoveTip(d.title, selector + ' .md' + c, 2);
                    }
                });
            }
            ;
        })
    }

    var sBS = function (e, f) {
        if (e) {
            if (f == 1) {
                var a = e.currentTarget.id;
                var b = $(e.currentTarget).closest('.map-tools');
                if (b.length == 0) {
                    b = $(e.currentTarget).closest('.mbussLayer');
                    var m = new UCMap.UCLoctions();
                    m.clearLayer();
                }
                var i = 0;
                //$('.mbussLayer .map-tools .mtool-box').removeClass('mtool-disabled');
                var k = $('.mbussLayer  dd');
                for (; i < k.length; i++) {
                    $('#' + k[i].id).removeClass('mtool-disabled');
                }
                i = 0;
                k = $('.mbussLayer i');
                for (; i < k.length; i++) {
                    $(k[i]).removeAttr('class')
                }
                // $('.mbussLayer  dd').removeClass('mtool-disabled');
                setBoxOpen(a, b);
            }
            else if (f == 0) {
                setBoxClose();
            }
        }
    }
    var sBO = function (i, m) {
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
                if ($("#" + i)[0].className.indexOf('mtool-box') >= 0)
                    $('#' + i + ' i:first').addClass('seleted seleted-box');
                else
                    $('#' + i + ' i:first').addClass('seleted seleted-child');
            }

            if ($('#' + i).is('dd')) {
                var a = $('#' + i).closest('.mtool-box')[0].id;
                $('#' + a).removeClass('mtool-disabled');
                $('#' + a + ' dd:not(#' + i + ')').removeClass('mtool-disabled');
            }
        }
    }
    var sBC = function () {
        $('.map-tools i').removeAttr('class');
        $('.map-tools .mtool-box').removeClass('mtool-disabled');
        $('.map-tools  dd').removeClass('mtool-disabled');
    }

    /**
     *
     * @type {SPMap.Data}
     */
    var d = function () {

    }
    d.prototype.get = function (url, data, callback) {

    }
    d.prototype.set = function () {

    }
    d.prototype.update=function (data) {
        
    }

    var g=function () {

    }
    /**
     * @param [Object] point {lng,lat}
     * @param [function] cbfunc(rs)
     */
    g.prototype.decoder=function (point,cbfunc) {
        if ($lonlat(point.lng, point.lat)) {
            var geoc = new BMap.Geocoder();
            var pt = new BMap.Point(point.lng, point.lat);
            geoc.getLocation(pt, function (rs) {
                if (cbfunc && typeof  cbfunc == 'function')
                    var addComp = rs.addressComponents;
                var ads = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                cbfunc({point: rs.point, address: ads});
            });
        }
    }

    /**
     * @param [String|Object] city/map
     * @param [String] address
     * @param [Function] cbfunc
     */
    g.prototype.coder=function (obj,address,cbfunc) {
        var ls = new BMap.LocalSearch(obj);
        ls.clearResults();
        ls.search(address);
        ls.enableAutoViewport();
        ls.setSearchCompleteCallback(function (rs) {
            var a = [];
            if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
                var rsl = rs.getCurrentNumPois();
                for (var p = 0; p < rsl; p++) {
                    var poi = rs.getPoi(p);
                    a.push({location: poi.point, title: poi.title, address: poi.address});
                }
                ;
            }
            if (cbfunc && typeof cbfunc == 'function') {
                cbfunc(a);
            };
        });
    };
    
    var $c = {
        ms:{},
        gc: Math.random().toString(16).replace('/./g', ''),
        am: function (elem,mp) {
            if (!(elem in this.ms))
                this.ms[elem] = mp;
        },
        gm: function (elem) {
            var _e=$(elem).parent().attr('id');
            if (_e in this.ms)
                return  this.ms[_e];
        },
    }
    var val={
        get:function (elem) {
            return $c.gm(elem);
        }
    }

    exports.$val=val;
    exports.Map=m;
    Object.defineProperty(exports, '__esModule', {value: true});
})));
