//坐标转换
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.PjComm = global.PjComm || {})));
}(this, (function (exports) {
    'use strict';
    var _map = null;


    var PjConvertor = function (map) {
        _map = map;
    }

    PjConvertor.prototype.PointToMercator = function (point) {
        if (_map == null)
            return;
        var p = _map.getMapType().getProjection().lngLatToPoint(point);
        return {x: p.x, y: p.y};
    }
    PjConvertor.prototype.MercatorToPoint = function (mercator) {
        if (_map == null)
            return;
        var p = _map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(mercator.x, mercator.y));
        return {lng: p.lng, lat: p.lat};
    }
    PjConvertor.prototype.MercatorToPixel = function (mercator) {
        if (_map == null)
            return;
        var p = new BMap.Pixel(Math.floor(mercator.x * Math.pow(2, _map.getZoom() - 18)),
            Math.floor(mercator.y * Math.pow(2, _map.getZoom() - 18)));
        return {x: p.x, y: p.y};
    }
    PjConvertor.prototype.PixelToTileCoord = function (pixel) {
        var p = new BMap.Pixel(Math.floor(pixel.x / 256),
            Math.floor(pixel.y / 256));
        return {x: p.x, y: p.y};
    }
    PjConvertor.prototype.PointToViewerPixel = function (point) {
        if (_map == null)
            return;
        var p = _map.pointToPixel(point);
        return {x: p.x, y: p.y};
    }
    PjConvertor.prototype.ViewerPixelToPoint = function (pixel) {
        if (_map == null)
            return;
        var p = _map.pixelToPoint(pixel);
        return {lng: p.lng, lat: p.lat};
    }
    PjConvertor.prototype.PointToOverlayPixel = function (point) {
        if (_map == null)
            return;
        var p = _map.pointToOverlayPixel(point);
        return {x: p.x, y: p.y};
    }
    PjConvertor.prototype.MercatorToViewerPixel = function (mercator) {
        if (_map == null)
            return;
        var m = this.MercatorToPoint(mercator);
        var p = this.PointToViewerPixel(m);
        return {x: p.x, y: p.y};
    }
    /*
    长度(m)转像素大小
     */
    PjConvertor.prototype.MetricToPixel = function (size) {
        var p = Math.pow(2, 18 - _map.getZoom());
        var f = size / p;
        return f + f / 10;
    }

    PjConvertor.prototype.mapbartoWgs84=function (x, y) {
        x = parseFloat(x) * 100000 % 36000000;
        y = parseFloat(y) * 100000 % 36000000;

       var x1 = parseInt( - (((Math.cos(y / 100000)) * (x / 18000)) + ((Math.sin(x / 100000)) * (y / 9000))) + x);
        var  y1 = parseInt( - (((Math.sin(y / 100000)) * (x / 18000)) + ((Math.cos(x / 100000)) * (y / 9000))) + y);

        var x2 = parseInt( - (((Math.cos(y1 / 100000)) * (x1 / 18000)) + ((Math.sin(x1 / 100000)) * (y1 / 9000))) + x + ((x > 0) ? 1 : -1));
        var  y2 = parseInt( - (((Math.sin(y1 / 100000)) * (x1 / 18000)) + ((Math.cos(x1 / 100000)) * (y1 / 9000))) + y + ((y > 0) ? 1 : -1));

        return [x2 / 100000.0, y2 / 100000.0];
    }

    /**
     * @param {JsonArray} points [{lng,lat}]
     * @return {Array}
     * @constructor
     */
    PjConvertor.prototype.PointToAddress=function (points) {
        var myGeo = new BMap.Geocoder();
        var address=[];
        points.forEach(function (a,b) {
            var cen=coordtransform.wgs84tobd09(b.lng,b.lat)
            myGeo.getLocation(new BMap.Point(cen.lng, cen.lat), function (result) {
                if (result&&result.surroundingPois.length>0) {
                    address.push( result.surroundingPois);
                }
            })
        })
        return address;
    }


    var PjMapData = function (map) {
        _map = map;
    }

    /*
   获取范围最大最小点坐标
   MMPoint={}
   Lng 经度
   Lat 纬度
    */
    PjMapData.prototype.GetMaxMinPoint = function (MMPoint, Lng, Lat) {
        if (!MMPoint)
            return;
        if (MMPoint.MaxLng === undefined || Lng > MMPoint.MaxLng) {
            MMPoint.MaxLng = Lng;
        }
        if (MMPoint.MaxLat === undefined || Lat > MMPoint.MaxLat) {
            MMPoint.MaxLat = Lat;
        }
        if (MMPoint.MinLng === undefined || Lng < MMPoint.MinLng) {
            MMPoint.MinLng = Lng;
        }
        if (MMPoint.MinLat === undefined || Lat < MMPoint.MinLat) {
            MMPoint.MinLat = Lat;
        }
    }
    /*
     获取符合范围的等级
     bounds{MaxLng:maxLng,MaxLat:maxLat,MinLng:minLng,MinLat:minLat}
      */
    PjMapData.prototype.GetZoomInBounds = function (bounds) {
        if (!bounds || !bounds.MaxLng || !bounds.MaxLat || !bounds.MinLng || !bounds.MinLat)
            return;
        var leftpoint = new BMap.Point(bounds.MinLng, bounds.MaxLat);
        var rightpoint = new BMap.Point(bounds.MaxLng, bounds.MinLat);
        var zoom = ["20", "50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。
        var distance = _map.getDistance(leftpoint, rightpoint).toFixed(1);  //获取两点距离,保留小数点后两位
        for (var i = 0; i < zoom.length; i++) {
            if (zoom[i] - distance > 0) {
                var z = 18 - i + 3;
                return z < 15 ? 15 : z > 18 ? 18 : z; //地图范围常常是比例尺距离的10倍以上 所以加3
            }
        }
    }

    // /*
    // data:{lng:,lat:,deg}
    // option:offset{x,y}
    //  */
    // PjMapData.prototype.GetLabelLocation = function (data, option) {
    //     var h = option.offset.y || 0;
    //     var w = option.offset.x || 0;
    //     var _data = [];
    //     var _d;
    //     var g;
    //     var p;
    //     var pj=new PjComm.PjConvertor(_map);
    //     $.each(data, function (a, b) {
    //         p = pj.PointToViewerPixel(b);
    //         if (b.deg == undefined) {
    //             _d = b;
    //         }
    //         else if (b.deg == 0 || b.deg == 360) {
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x, p.y - h))
    //         }
    //         else if (b.deg > 0 && b.deg < 90) {
    //             g = Math.PI / 180 * b.deg;
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w * Math.abs(Math.sin(g)), p.y - h * Math.abs(Math.cos(g))))
    //         }
    //         else if (b.deg == 90) {
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w, p.y))
    //         }
    //         else if (b.deg > 90 && b.deg < 180) {
    //             g = Math.PI / 180 * (180 - b.deg);
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w * Math.abs(Math.sin(g)), p.y + h * Math.abs(Math.cos(g))))
    //         }
    //         else if (b.deg == 180) {
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x, p.y + h))
    //         }
    //         else if (b.deg > 180 && b.deg < 270) {
    //             g = Math.PI / 180 * (270 - b.deg);
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w * Math.abs(Math.cos(g)), p.y + h * Math.abs(Math.sin(g))))
    //         }
    //         else if (b.deg == 270) {
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w, p.y))
    //         }
    //         else if (b.deg > 270 && b.deg < 360) {
    //             g = Math.PI / 180 * (360 - b.deg);
    //             _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w * Math.abs(Math.sin(g)), p.y - h * Math.abs(Math.cos(g))))
    //         }
    //         _d.deg=b.deg;
    //         if (_d)
    //             _data.push(_d);
    //         _d = undefined;
    //     })
    //     return _data;
    // }
    /*
  data:[{lng:,lat:,deg}]
  offset:{x,y}
   */
    PjMapData.prototype.SetOffsetPoint = function (data, offset) {
        if(_map==undefined)
            return ;
        var h = (offset && offset.y) || 0;
        var w = (offset && offset.x) || 0;
        var _d;var g;var p;var b;
        var pj = new PjComm.PjConvertor(_map);
        var j = 0;
        for (; j < data.length; j++) {
            b = data[j];
            if (h == 0 && w == 0)
            {
                b["ofslng"]=b.lng;
                b["ofslat"]=b.lat;
                continue;
            }
            if (b.deg != undefined) {
                var p = pj.PointToViewerPixel(new BMap.Point(b.lng, b.lat));
                if (b.deg == 0 || b.deg == 360) {
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x, p.y - h))
                }
                else if (b.deg > 0 && b.deg < 90) {
                    g = Math.PI / 180 * b.deg;
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w * Math.abs(Math.sin(g)), p.y - h * Math.abs(Math.cos(g))))
                }
                else if (b.deg == 90) {
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w, p.y))
                }
                else if (b.deg > 90 && b.deg < 180) {
                    g = Math.PI / 180 * (180 - b.deg);
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x + w * Math.abs(Math.sin(g)), p.y + h * Math.abs(Math.cos(g))))
                }
                else if (b.deg == 180) {
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x, p.y + h))
                }
                else if (b.deg > 180 && b.deg < 270) {
                    g = Math.PI / 180 * (270 - b.deg);
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w * Math.abs(Math.cos(g)), p.y + h * Math.abs(Math.sin(g))))
                }
                else if (b.deg == 270) {
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w, p.y))
                }
                else if (b.deg > 270 && b.deg < 360) {
                    g = Math.PI / 180 * (360 - b.deg);
                    _d = pj.ViewerPixelToPoint(new BMap.Pixel(p.x - w * Math.abs(Math.sin(g)), p.y - h * Math.abs(Math.cos(g))))
                }
                b["ofslng"] = _d.lng;
                b["ofslat"] = _d.lat;
            }
        }
    }

    exports.PjConvertor = PjConvertor;
    exports.PjMapData = PjMapData;

    Object.defineProperty(exports, '__esModule', {value: true});
})));